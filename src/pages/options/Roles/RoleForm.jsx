import React from 'react';

const RoleForm = ({ formData, handleChange, handleSubmit, handleCloseModal, error, rolesText }) => (
  <form onSubmit={handleSubmit}>
    <div className="mb-4">
      <label className="block text-gray-700">{rolesText.roleName}</label>
      <input
        type="text"
        name="roleName"
        value={formData.roleName}
        onChange={handleChange}
        className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700">{rolesText.permissions}</label>
      <div className="flex flex-col space-y-2">
        <label>
          <input
            type="checkbox"
            name="users"
            checked={formData.permissions.users}
            onChange={handleChange}
          />
          {rolesText.users}
        </label>
        <label>
          <input
            type="checkbox"
            name="clients"
            checked={formData.permissions.clients}
            onChange={handleChange}
          />
          {rolesText.clients}
        </label>
        <label>
          <input
            type="checkbox"
            name="profile"
            checked={formData.permissions.profile}
            onChange={handleChange}
          />
          {rolesText.profile}
        </label>
        <label>
          <input
            type="checkbox"
            name="roles"
            checked={formData.permissions.roles}
            onChange={handleChange}
          />
          {rolesText.roles}
        </label>
      </div>
    </div>
    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
    <div className="flex justify-end">
      <button
        type="button"
        onClick={handleCloseModal}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition mr-2"
      >
        {rolesText.cancel}
      </button>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {rolesText.update}
      </button>
    </div>
  </form>
);

export default RoleForm;
