import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { db } from '../../connection/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const CustomSelectUsers = ({ placeholder, onChange, selectedValue, role = '' }) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let usersQuery = collection(db, 'users');

        // Si role es un string (solo un rol)
        if (typeof role === 'string' && role) {
          if (role.toLowerCase().includes('cliente')) {
            // Lógica especial para roles que contienen "Cliente"
            usersQuery = query(
              usersQuery,
              where('role', '>=', 'Cliente'),
              where('role', '<=', 'Cliente\uf8ff')
            );
          } else {
            // Filtro por un único rol exacto
            usersQuery = query(usersQuery, where('role', '==', role));
          }
        } 
        // Si se pasan varios roles (array)
        else if (Array.isArray(role) && role.length > 0) {
          usersQuery = query(usersQuery, where('role', 'in', role)); // Filtrar por múltiples roles
        }

        const querySnapshot = await getDocs(usersQuery);
        const optionsList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const label = data.username || data.name || data.nombre || 'Sin nombre';

          return {
            label: label,
            value: doc.id,
            ...data, // Devolver todos los datos del usuario
          };
        });

        // Añadir una opción de placeholder al principio
        setOptions([{ label: 'Seleccionar cliente', value: null }, ...optionsList]);
      } catch (error) {
        console.error('Error al obtener usuarios: ', error);
      }
    };

    fetchUsers();
  }, [role]);

  // Actualiza selectedOption cuando cambie selectedValue o las opciones
  useEffect(() => {
    const matchingOption = options.find(
      (option) => option.value === selectedValue?.value
    );
    setSelectedOption(matchingOption || null);
  }, [selectedValue, options]);

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={(selected) => {
        const matchingOption = options.find(
          (option) => option.value === selected.value
        );
        setSelectedOption(matchingOption);
        onChange(selected);
      }}
      placeholder={placeholder}
      className="flex-grow min-w-[30vh] w-full"
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
    />
  );
};

export default CustomSelectUsers;
