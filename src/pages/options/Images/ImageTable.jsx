import React, { useState, useEffect } from 'react';
import ImageTableFilters from './ImageTableFilters';
import ImageTableBody from './ImageTableBody';

const ImageTable = ({ images, triggerUpdate, stateFilter }) => {
  const [filteredImages, setFilteredImages] = useState([]);

  useEffect(() => {
    // Filtrar imágenes por estado (activo o inactivo)
    const filteredByState = images.filter(image => image.state === stateFilter);
    setFilteredImages(filteredByState);
  }, [images, stateFilter]);

  const handleFilterChange = (filterType, filterValue) => {
    const filtered = images
      .filter(image => image.state === stateFilter) // Asegurarse de que se mantenga el filtro por estado
      .filter(image => image[filterType].toLowerCase().includes(filterValue.toLowerCase()));
    setFilteredImages(filtered);
  };

  return (
    <div className="min-h-[70vh] max-h-[70vh] overflow-auto">
      <h3 className="text-lg font-bold mb-2 ">Lista de Imágenes</h3>
        <ImageTableFilters onFilterChange={handleFilterChange} />
        <ImageTableBody images={filteredImages} triggerUpdate={triggerUpdate} stateFilter={stateFilter}/>
    </div>
  );
};

export default ImageTable;
