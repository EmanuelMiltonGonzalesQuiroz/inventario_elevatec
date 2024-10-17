import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaUser, FaUsers} from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { MdOutlineAdminPanelSettings,MdOutlineInventory } from 'react-icons/md';

const Sidebar = ({ activeContent, setActiveContent, permissions }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMinimized(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleSidebar = () => setIsMinimized(!isMinimized);

  const renderItem = (text, icon, contentKey, permissionKey) => {
    if (permissions[permissionKey]) {
      return (
        <li
          className={`p-4 cursor-pointer flex items-center ${activeContent === contentKey ? 'bg-orange-500' : ''}`}
          onClick={() => setActiveContent(contentKey)}
        >
          {icon}
          {!isMinimized && <span className="ml-4">{text}</span>}
        </li>
      );
    }
    return null;
  };

  return (
    <div className={`bg-gray-900 text-white flex flex-col transition-all duration-300 h-full ${isMinimized ? 'w-16' : 'min-w-[30vh]'}`}>
      <div className="p-4 flex justify-between items-center">
        {!isMinimized && <span className="text-lg font-bold">ELEVATEC</span>}
        <button onClick={handleToggleSidebar} className="text-white">
          {isMinimized ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
      <nav className="flex-grow overflow-y-auto">
        <ul>
          {renderItem('Usuarios', <FaUser />, 'Usuarios', 'users')}
          {renderItem('Clientes', <FaUsers />, 'Clientes', 'clients')}
          {renderItem('Perfil', <CgProfile />, 'Perfil', 'profile')}
          {renderItem('Roles', <MdOutlineAdminPanelSettings />, 'Roles', 'roles')}
          {renderItem('Documentos', <MdOutlineInventory />, 'Inventario', 'inventory')}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
