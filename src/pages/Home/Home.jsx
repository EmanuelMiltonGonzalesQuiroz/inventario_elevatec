import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../connection/firebase';
import Inventory from '../options/Inventory/Inventory';
import Images from '../options/Images/Images'; // Nuevo componente para gestionar imágenes

// Lazy loading para nuevos componentes
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
    if (currentUser) {
      const timer = setTimeout(() => {
        logout();
        window.location.href = '/login';
      }, 3600000); // 1 hora
      return () => clearTimeout(timer);
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
    <div className="flex flex-col h-screen sm:overflow-auto overflow-y-hidden">
      <Header className="h-[10%] flex-shrink-0" />
      <div className="flex flex-grow">
        <Sidebar
          activeContent={activeContent}
          setActiveContent={setActiveContent}
          permissions={isLoadingPermissions ? temporaryPermissions : permissions}
        />
        <main className="flex-grow bg-gray-100 p-6 min-w-[80vh]">
          <div className="w-full">
            <Suspense fallback={<div>Loading...</div>}>
              {(isLoadingPermissions || permissions.profile) && activeContent === 'Perfil' && <Profile />}
              {!isLoadingPermissions && permissions.users && activeContent === 'Usuarios' && <Users />}
              {!isLoadingPermissions && permissions.clients && activeContent === 'Clientes' && <Clients />}
              {!isLoadingPermissions && permissions.roles && activeContent === 'Roles' && <Roles />}
              {!isLoadingPermissions && permissions.inventory && activeContent === 'Inventario' && <Inventory />}
              {!isLoadingPermissions && permissions.images && activeContent === 'Imágenes' && <Images />} {/* Nueva opción para Imágenes */}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
