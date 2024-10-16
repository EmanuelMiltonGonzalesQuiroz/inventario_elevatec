import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import { rolesText, permissionTranslations } from '../../../components/common/Text/texts';
import RoleTable from './RoleTable';
import RoleModal from './RoleModal';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [currentRoleId, setCurrentRoleId] = useState(null);
  const [formData, setFormData] = useState({
    roleName: '',
    permissions: {},
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const rolesCollection = collection(db, 'roles');
      const rolesSnapshot = await getDocs(rolesCollection);
      const rolesList = rolesSnapshot.docs.map((doc, index) => ({
        id: doc.id,
        index: index + 1,
        roleName: doc.id,
        permissions: doc.data(), // Load all permissions dynamically
      }));
      setRoles(rolesList);
    } catch (error) {
      console.error('Error loading roles: ', error);
    }
  };

  const handleOpenModal = (role = null) => {
    if (role) {
      setCurrentRoleId(role.id);
      setFormData(role);
    } else {
      setCurrentRoleId(null);
      setFormData({
        roleName: '',
        permissions: {}, // Initialize with empty permissions for new role
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError('');
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    if (name === 'roleName') {
      // Update the role name separately
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      // Update permissions dynamically
      setFormData({
        ...formData,
        permissions: {
          ...formData.permissions,
          [name]: type === 'checkbox' ? checked : value, // Handle checkbox and other input types
        },
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { roleName, permissions } = formData;

    if (!roleName) {
      setError(rolesText.allFieldsRequired);
      return;
    }

    try {
      if (currentRoleId) {
        const roleRef = doc(db, 'roles', currentRoleId);
        await updateDoc(roleRef, permissions);
      } else {
        const newRoleRef = doc(db, 'roles', roleName); // Use roleName as document ID
        await setDoc(newRoleRef, permissions);
      }
      loadRoles();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving role: ', error);
    }
  };

  const handleDeleteRole = async (roleId) => {
    try {
      await deleteDoc(doc(db, 'roles', roleId));
      loadRoles();
    } catch (error) {
      console.error('Error deleting role: ', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 text-black">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{rolesText.title}</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => handleOpenModal()}
        >
          {rolesText.addRole}
        </button>
      </div>
      <RoleTable
        roles={roles}
        handleOpenModal={handleOpenModal}
        handleDeleteRole={handleDeleteRole}
        rolesText={rolesText}
        permissionTranslations={permissionTranslations} // Dynamic permission translations
      />
      <RoleModal
        isModalOpen={isModalOpen}
        handleSubmit={handleSubmit}
        handleCloseModal={handleCloseModal}
        formData={formData}
        handleChange={handleChange}
        error={error}
        rolesText={rolesText}
        permissionTranslations={permissionTranslations} // Dynamic permission translations
      />
    </div>
  );
};

export default Roles;
