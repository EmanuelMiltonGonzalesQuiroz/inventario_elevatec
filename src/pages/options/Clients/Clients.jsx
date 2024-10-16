import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import ClientModal from './ClientModal';
import { useAuth } from '../../../context/AuthContext';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const { currentUser } = useAuth();
  const [currentClientId, setCurrentClientId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    role: 'Cliente',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const clientsList = usersSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          fechaCreacion: doc.data().fechaCreacion || '', // Agregar fecha de creación si está disponible
          ...doc.data(),
        }))
        .filter((user) => user.role.toLowerCase().includes('cliente'))
        .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)); // Ordenar del más nuevo al más viejo

      setClients(clientsList);
    } catch (error) {
      console.error('Error al cargar los clientes: ', error);
    }
  };

  const handleOpenModal = (client = null) => {
    if (client) {
      setCurrentClientId(client.id);
      setFormData({ ...client });
    } else {
      setCurrentClientId(null);
      setFormData({ username: '', email: '', phone: '', password: '', role: 'Cliente' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { username, email, phone, password } = formData;

    if (!username || !email || !phone || !password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      if (currentClientId) {
        await updateDoc(doc(db, 'users', currentClientId), { username, email, phone, password });
      } else {
        await addDoc(collection(db, 'users'), { ...formData, fechaCreacion: new Date().toISOString() });
      }
      loadClients();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar el cliente: ', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredClients = clients.filter((client) =>
    client.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      loadClients();
    } catch (error) {
      console.error('Error al eliminar el usuario: ', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 text-black">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o correo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-1/3 focus:outline-none"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => handleOpenModal()}
        >
          Agregar Cliente
        </button>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className='text-black font-bold'>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Correo</th>
            {(currentUser.role === 'Administrador' || currentUser.role === 'Gerencia') && (
              <th className="border px-4 py-2">Contraseña</th>
            )}
            <th className="border px-4 py-2">Teléfono</th>
            <th className="border px-4 py-2">Rol</th>
            {(currentUser.role === 'Administrador' || currentUser.role === 'Gerencia'|| currentUser.role === 'Super Usuario') && (
              <th className="border px-4 py-2">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredClients.length > 0 ? (
            filteredClients.map((client, index) => (
              <tr key={client.id} className='text-black'>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{client.username || 'N/A'}</td>
                <td className="border px-4 py-2">{client.email || 'N/A'}</td>
                {(currentUser.role === 'Administrador' || currentUser.role === 'Gerencia') && (
                  <td className="border px-4 py-2">{client.password || 'N/A'}</td>
                )}
                <td className="border px-4 py-2">{client.phone || 'N/A'}</td>
                <td className="border px-4 py-2">{client.role || 'N/A'}</td>
                {(currentUser.role === 'Administrador' || currentUser.role === 'Gerencia'|| currentUser.role === 'Super Usuario') && (
                  <td className="border px-4 py-2 flex justify-center items-center ">
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 transition mr-2"
                      onClick={() => handleOpenModal(client)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                      onClick={() => handleDeleteUser(client.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="border px-4 py-2 text-center text-gray-500">
                No se encontraron clientes
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        // Inside the ClientModal invocation
        <ClientModal
          currentClientId={currentClientId}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleCloseModal={handleCloseModal}
          handleClientAdded={loadClients} // Llamada a la función para actualizar la lista de clientes
          error={error}
        />

      )}
    </div>
  );
};

export default Clients;
