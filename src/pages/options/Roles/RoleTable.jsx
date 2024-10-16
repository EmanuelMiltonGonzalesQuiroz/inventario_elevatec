import React from 'react';

const RoleTable = ({ roles, handleOpenModal, handleDeleteRole, rolesText, permissionTranslations }) => (
  <div className="max-h-[65vh] overflow-auto">
    <table className="min-w-full bg-white border">
      <thead>
        <tr className="text-black font-bold">
          <th className="border px-4 py-2">{rolesText.index}</th>
          <th className="border px-4 py-2">{rolesText.roleName}</th>
          <th className="border px-4 py-2">{rolesText.permissions}</th>
          <th className="border px-4 py-2">{rolesText.actions}</th>
        </tr>
      </thead>
      <tbody>
        {roles.map((role) => (
          <tr key={role.id} className="text-black">
            <td className="border px-4 py-2 text-center">{role.index}</td>
            <td className="border px-4 py-2 text-center">{role.roleName}</td>
            <td className="border px-4 py-2">
              <div className="flex flex-wrap justify-center">
                {Object.keys(role.permissions)
                  .filter((key) => role.permissions[key])
                  .map((perm) => (
                    <span
                      key={perm}
                      className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded mb-2"
                    >
                      {permissionTranslations[perm] || perm}: Sí
                    </span>
                  ))}
              </div>
            </td>
            <td className="border px-4 py-2 text-center">
              <div className="flex justify-center items-center space-x-2">
                <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 transition mr-2"
                    onClick={() => handleOpenModal(role)}
                  >
                    {rolesText.edit}
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    onClick={() => handleDeleteRole(role.id)}
                  >
                    {rolesText.delete}
                  </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
);

export default RoleTable;
