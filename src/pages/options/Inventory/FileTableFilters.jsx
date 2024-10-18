import React, { useState } from 'react';
import CustomSelectUsers from '../../../components/UI/CustomSelectUsers'; // Importar el componente CustomSelectUsers

const FileTableFilters = ({ onFilterChange }) => {
  const [nameFilter, setNameFilter] = useState('');
  const [creatorFilter, setCreatorFilter] = useState(null); // Cambiado a null
  const [dateFilter, setDateFilter] = useState('');
  const [clientFilter, setClientFilter] = useState(null); // Estado para el cliente seleccionado

  const handleNameChange = (e) => {
    setNameFilter(e.target.value);
    onFilterChange('name', e.target.value);
  };

  const handleCreatorChange = (selectedCreator) => {
    setCreatorFilter(selectedCreator); // Actualizar con el objeto seleccionado
    onFilterChange('uploadedBy', selectedCreator?.value || ''); // Asegurarse de manejar correctamente los valores
  };

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
    onFilterChange('uploadedAt', e.target.value);
  };

  const handleClientChange = (selectedClient) => {
    setClientFilter(selectedClient);
    onFilterChange('uploadedFor', selectedClient?.value || '');
  };

  return (
    <div className="flex gap-4 mb-4 flex-col-4">
      <div>
        <label className="block mb-1">Nombre</label>
        <input
          type="text"
          value={nameFilter}
          onChange={handleNameChange}
          className="border px-2 py-1 rounded w-full"
          placeholder="Nombre"
        />
      </div>
      <div>
        <label className="block mb-1">Creador</label>
        <CustomSelectUsers
          placeholder="Seleccionar creador"
          onChange={handleCreatorChange}
          selectedValue={creatorFilter} // Pasar el objeto seleccionado, no el valor directo
          role={["Super Usuario", "Gerencia", "Administrador"]}
        />
      </div>
      <div>
        <label className="block mb-1">Fecha</label>
        <input
          type="date"
          value={dateFilter}
          onChange={handleDateChange}
          className="border px-2 py-1 rounded w-full"
        />
      </div>
      <div className="w-full">
        <label className="block mb-1">Cliente</label>
        <CustomSelectUsers
          placeholder="Seleccionar cliente"
          onChange={handleClientChange}
          selectedValue={clientFilter} // Pasar el objeto seleccionado, no el valor directo
          role="Cliente" // Filtrar solo por el rol de clientes
        />
      </div>
    </div>
  );
};

export default FileTableFilters;
