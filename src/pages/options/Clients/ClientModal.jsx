import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, setDoc, query, where } from 'firebase/firestore';
import { db } from '../../../connection/firebase';

const ClientModal = ({ currentClientId, handleCloseModal, handleClientAdded, error }) => {
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    role: '',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadRoles();
    if (currentClientId) {
      loadClientData(currentClientId); // Cargar los datos del cliente si estamos editando
    }
  }, [currentClientId]);

  const loadRoles = async () => {
    try {
      const rolesCollection = collection(db, 'roles');
      const rolesSnapshot = await getDocs(rolesCollection);
      const rolesList = rolesSnapshot.docs
        .map((doc) => doc.id)
        .filter((role) => role.toLowerCase().includes('cliente'));
      setRoles(rolesList);
    } catch (error) {
      console.error('Error al cargar los roles: ', error);
    }
  };

  const loadClientData = async (clientId) => {
    try {
      const clientDoc = await getDoc(doc(db, 'users', clientId));
      if (clientDoc.exists()) {
        setFormData(clientDoc.data()); // Cargar los datos del cliente en el estado del formulario
      } else {
        console.error('Cliente no encontrado');
      }
    } catch (error) {
      console.error('Error al cargar los datos del cliente: ', error);
    }
  };

  const checkEmailExists = async (email) => {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Si no está vacío, significa que ya existe un cliente con ese correo
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setFormError(''); // Limpiar cualquier error anterior

    if (!formData.email) {
      setFormError('El correo electrónico es requerido.');
      return;
    }

    try {
      // Verificar si el email ya existe en Firestore
      const emailExists = await checkEmailExists(formData.email);
      
      if (emailExists && !currentClientId) {
        setFormError('Este correo ya está en uso por otro cliente.');
        return;
      }

      if (!currentClientId) {
        // Nuevo cliente
        const newClientData = {
          ...formData,
          fechaCreacion: new Date().toISOString(),
        };

        const newClientRef = doc(collection(db, 'users'));
        await setDoc(newClientRef, newClientData);
        handleClientAdded(); // Llamada a la función para actualizar la lista de clientes
        handleCloseModal();
      } else {
        // Si estamos editando un cliente existente
        await setDoc(doc(db, 'users', currentClientId), formData);
        handleClientAdded(); // Llamada a la función para actualizar la lista de clientes
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error al agregar o actualizar el cliente: ', error);
      setFormError('Ocurrió un error al guardar el cliente.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[60%] max-h-[90%] ">
        <h2 className="text-xl font-bold mb-4">
          {currentClientId ? 'Editar Cliente' : 'Agregar Cliente'}
        </h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Correo</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Teléfono</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Rol</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
            >
              <option value="" disabled>Seleccionar rol</option>
              {roles.map((role, index) => (
                <option key={index} value={role}>{role}</option>
              ))}
            </select>
          </div>
          {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCloseModal}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {currentClientId ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;
