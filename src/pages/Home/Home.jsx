import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../connection/firebase';
import Inventory from '../options/Inventory/Inventory';
// Lazy loading for new components
const Users = lazy(() => import('../options/Users/Users'));
const Clients = lazy(() => import('../options/Clients/Clients'));
const Roles = lazy(() => import('../options/Roles/Roles'));
const Profile = lazy(() => import('../options/Profile/Profile'));

const Home = () => {
  const { currentUser, logout } = useAuth();
  const [activeContent, setActiveContent] = useState('Perfil');
  const [permissions, setPermissions] = useState(null);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

  const loadPermissions = useCallback(async () => {
    if (currentUser) {
      try {
        const roleDoc = await getDoc(doc(db, 'roles', currentUser.role));
        if (roleDoc.exists()) {
          const roleData = roleDoc.data();
          setPermissions(roleData || {});
        } else {
          console.error('No se encontraron permisos para este rol');
          setPermissions({});
        }
      } catch (error) {
        console.error('Error al cargar los permisos del rol:', error);
        setPermissions({});
      } finally {
        setIsLoadingPermissions(false);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  useEffect(() => {
    // Configurar el temporizador para cerrar sesión automáticamente después de una hora
    if (currentUser) {
      const timer = setTimeout(() => {
        logout(); // Cerrar la sesión automáticamente después de una hora
        window.location.href = '/login'; // Redirigir al login
      }, 3600000); // 3600000 milisegundos = 1 hora

      return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
    }
  }, [currentUser, logout]);

  if (!currentUser) {
    window.location.href = '/login';
    return null;
  }

  const temporaryPermissions = {
    profile: true,
  };

  return (
    <div className="flex flex-col h-screen sm:overflow-auto overflow-y-hidden">  {/* Limitar desbordamiento solo en el eje y */}
      <Header className="h-[10%] flex-shrink-0" />
      <div className="flex flex-grow "> {/* Control del desbordamiento solo en el eje y */}
        <Sidebar
          activeContent={activeContent}
          setActiveContent={setActiveContent}
          permissions={isLoadingPermissions ? temporaryPermissions : permissions}
        />
        <main className="flex-grow bg-gray-100 p-6  min-w-[80vh]"> {/* Permitir que el contenido principal se desplace en pantallas grandes */}
          <div className="w-full">
            <Suspense fallback={<div>Loading...</div>}>
              {(isLoadingPermissions || permissions.profile) && activeContent === 'Perfil' && <Profile />}
              {!isLoadingPermissions && permissions.users && activeContent === 'Usuarios' && <Users />}
              {!isLoadingPermissions && permissions.clients && activeContent === 'Clientes' && <Clients />}
              {!isLoadingPermissions && permissions.roles && activeContent === 'Roles' && <Roles />}
              {!isLoadingPermissions && permissions.inventory && activeContent === 'Inventario' && <Inventory />}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
  
  
};

export default Home;
