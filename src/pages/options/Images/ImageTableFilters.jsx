import React, { useState } from 'react';
import CustomSelectUsers from '../../../components/UI/CustomSelectUsers'; // Importar el componente CustomSelectUsers

const ImageTableFilters = ({ onFilterChange }) => {
  const [nameFilter, setNameFilter] = useState('');
  const [creatorFilter, setCreatorFilter] = useState(null); // Cambiado a null
  const [descriptionFilter, setDescriptionFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const handleNameChange = (e) => {
    setNameFilter(e.target.value);
    onFilterChange('name', e.target.value);
  };

  const handleCreatorChange = (selectedCreator) => {
    setCreatorFilter(selectedCreator); // Actualizar con el objeto seleccionado
    onFilterChange('uploadedBy', selectedCreator?.value || ''); // Asegurarse de manejar correctamente los valores
  };

  const handleDescriptionChange = (e) => {
    setDescriptionFilter(e.target.value);
    onFilterChange('description', e.target.value);
  };

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
    onFilterChange('uploadedAt', e.target.value);
  };

  return (
    <div className="flex gap-4 mb-4">
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
          role={["Super Usuario", "Gerencia", "Administrador"]} // Roles permitidos para crear imágenes
        />
      </div>
      <div>
        <label className="block mb-1">Descripción</label>
        <input
          type="text"
          value={descriptionFilter}
          onChange={handleDescriptionChange}
          className="border px-2 py-1 rounded w-full"
          placeholder="Descripción"
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
    </div>
  );
};

export default ImageTableFilters;
