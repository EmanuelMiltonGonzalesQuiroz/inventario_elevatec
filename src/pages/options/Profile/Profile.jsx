import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import { useAuth } from '../../../context/AuthContext';

const Profile = () => {
  const { currentUser, login } = useAuth(); // `login` se usa para actualizar `currentUser`
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false); // Estado para cambiar contraseña
  const [newPassword, setNewPassword] = useState(''); // Estado para la nueva contraseña
  // eslint-disable-next-line no-unused-vars
  const [roles, setRoles] = useState([]); // Cargar roles desde Firestore
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    role: currentUser?.role || '',
  });

  useEffect(() => {
    // Cargar los datos del usuario en la base de datos
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        role: currentUser.role || '',
      });
    }
  }, [currentUser]);

  // Cargar roles desde la colección de Firestore
  const loadRoles = async () => {
    const rolesCollection = collection(db, 'roles');
    const rolesSnapshot = await getDocs(rolesCollection);
    const rolesList = rolesSnapshot.docs.map((doc) => doc.id); // Solo tomar los IDs como roles
    setRoles(rolesList);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      if (!currentUser?.id) {
        throw new Error('Usuario no encontrado');
      }

      const userDoc = doc(db, 'users', currentUser.id); // Asume que `currentUser.id` es el ID en Firestore

      await updateDoc(userDoc, {
        username: formData.username,
        phone: formData.phone,
      });

      // Actualizar el estado de `currentUser` localmente
      login({ ...currentUser, ...formData });

      setIsEditing(false); // Dejar de editar después de la actualización
    } catch (error) {
      console.error('Error al actualizar el usuario: ', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      username: currentUser.username,
      email: currentUser.email,
      phone: currentUser.phone,
      role: currentUser.role,
    });
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setNewPassword('');
  };

  const handlePasswordChange = async () => {
    try {
      if (!currentUser?.id) {
        throw new Error('Usuario no encontrado');
      }

      const userDoc = doc(db, 'users', currentUser.id);

      await updateDoc(userDoc, {
        password: newPassword,
      });

      setIsChangingPassword(false);
      setNewPassword('');
    } catch (error) {
      console.error('Error al cambiar la contraseña: ', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 text-black">
      <h2 className="text-2xl font-bold mb-6">Perfil de usuario</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-center">Mi Información</h3>
          {!isEditing && !isChangingPassword && 
            (currentUser.role === 'Administrador' || currentUser.role === 'Gerencia') && (
              <button
              onClick={() => setIsEditing(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Actualizar mis datos
            </button>
            )
          }
        </div>
        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="font-semibold">Nombre:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                readOnly
                className="p-2 border rounded w-full"
              />
          </div>

          {/* Rol del usuario */}
          <div>
            <label className="font-semibold">Rol de Usuario:</label>
            <input
              type="text"
              value={currentUser.role}
              readOnly
              className="p-2 border rounded w-full"
            />
          </div>

          {/* Correo electrónico */}
          <div>
            <label className="font-semibold">Correo electrónico:</label>
            <input
              type="email"
              value={currentUser.email}
              readOnly
              className="p-2 border rounded w-full "
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="font-semibold">Teléfono:</label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              />
            ) : (
              <p>{currentUser.phone}</p>
            )}
          </div>

          {/* Botones para guardar o cancelar cambios */}
          {isEditing && (
            <>
              <button
                onClick={handleUpdate}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Guardar cambios
              </button>
              <button
                onClick={handleCancelEdit}
                className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
            </>
          )}
        </div>

        {/* Sección para cambiar contraseña */}
        {!isEditing && !isChangingPassword && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Administrar mi contraseña</h3>
            <button
              onClick={() => setIsChangingPassword(true)}
              className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-700 transition"
            >
              Cambiar Contraseña
            </button>
          </div>
        )}

        {/* Modal para cambiar la contraseña */}
        {isChangingPassword && (
          <div className="mt-4 bg-gray-200 p-4 rounded-lg shadow-lg">
            <h4 className="text-lg font-semibold">Cambia tu contraseña</h4>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nueva contraseña"
              className="p-2 mt-2 border rounded w-full"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handlePasswordChange}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Guardar
              </button>
              <button
                onClick={handleCancelPasswordChange}
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
