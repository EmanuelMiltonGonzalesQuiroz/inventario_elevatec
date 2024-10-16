import React from 'react'; 

const RoleModal = ({ isModalOpen, handleSubmit, handleCloseModal, formData, handleChange, error, rolesText, permissionTranslations }) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[40%] max-h-[90%]">
        <h2 className="text-xl font-bold mb-4">
          {formData.roleName ? rolesText.editRole : rolesText.addRole}
        </h2>
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
            {Object.keys(permissionTranslations).map((permissionKey) => (
              <div key={permissionKey} className="mb-2">
                <label>
                  <input
                    type="checkbox"
                    name={permissionKey}
                    checked={formData.permissions[permissionKey] || false}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {permissionTranslations[permissionKey]}
                </label>
              </div>
            ))}
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
              {formData.roleName ? rolesText.update : rolesText.add}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;
