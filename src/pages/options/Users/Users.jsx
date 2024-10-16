import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import { usersText } from '../../../components/common/Text/texts';
import { useAuth } from '../../../context/AuthContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const { currentUser } = useAuth(); 
  const [roles, setRoles] = useState([]);  // Estado para almacenar los roles
  const [currentUserId, setCurrentUserId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    role: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
    loadRoles();  // Cargar los roles cuando se monta el componente
  }, []);

  const loadUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs
        .map((doc) => ({ id: doc.id, fechaCreacion: doc.data().fechaCreacion || '', ...doc.data() }))
        .filter((user) => !user.role.toLowerCase().includes('cliente'))
        .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)); // Ordenar del más nuevo al más viejo
      setUsers(usersList);
    } catch (error) {
      console.error('Error al cargar los usuarios: ', error);
    }
  };

  const loadRoles = async () => {
    try {
      const rolesCollection = collection(db, 'roles');
      const rolesSnapshot = await getDocs(rolesCollection);
      const rolesList = rolesSnapshot.docs
        .map((doc) => doc.id)  // Obtener solo los IDs de los documentos como roles
        .filter((role) => !role.toLowerCase().includes('cliente')); // Excluir roles que incluyan la palabra "cliente"
      setRoles(rolesList);
    } catch (error) {
      console.error('Error al cargar los roles: ', error);
    }
  };
  
  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      loadUsers();
    } catch (error) {
      console.error('Error al eliminar el usuario: ', error);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setCurrentUserId(user.id);
      setFormData(user);
    } else {
      setCurrentUserId(null);
      setFormData({ username: '', password: '', email: '', phone: '', role: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password, email, phone, role } = formData;

    if (!username || !password || !email || !phone || !role) {
      setError(usersText.allFieldsRequired);
      return;
    }

    try {
      if (currentUserId) {
        await updateDoc(doc(db, 'users', currentUserId), { username, password, email, phone, role });
      } else {
        await addDoc(collection(db, 'users'), { ...formData, fechaCreacion: new Date().toISOString() });
      }
      loadUsers();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar el usuario: ', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 bg-gray-100 text-black">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{usersText.title}</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => handleOpenModal()}
        >
          {usersText.addUser}
        </button>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className='text-black font-bold'>
            <th className="border px-4 py-2">{usersText.index}</th>
            <th className="border px-4 py-2">{usersText.username}</th>
            <th className="border px-4 py-2">{usersText.password}</th>
            <th className="border px-4 py-2">{usersText.email}</th>
            <th className="border px-4 py-2">{usersText.phone}</th>
            <th className="border px-4 py-2">{usersText.role}</th>
            {(currentUser.role === 'Administrador' || currentUser.role === 'Gerencia') && (
              <th className="border px-4 py-2">{usersText.actions}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className='text-black'>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">{user.password}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.phone}</td>
              <td className="border px-4 py-2">{user.role}</td>
              {(currentUser.role === 'Administrador' || currentUser.role === 'Gerencia') && (
                <td className="border px-4 py-2">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 transition mr-2 text-black"
                    onClick={() => handleOpenModal(user)}
                  >
                    {usersText.edit}
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition text-black"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    {usersText.delete}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table> 

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-black">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 w-[60%] max-h-[90%]">
            <h2 className="text-xl font-bold mb-4">
              {currentUserId ? usersText.editUser : usersText.addUser}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">{usersText.username}</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">{usersText.password}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">{usersText.email}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">{usersText.phone}</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">{usersText.role}</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
                >
                  <option value="" disabled>{usersText.selectRole}</option>
                  {roles.map((role, index) => (
                    <option key={index} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition mr-2"
                >
                  {usersText.cancel}
                </button>
                <button
                  type="submit" 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  {currentUserId ? usersText.update : usersText.add}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
