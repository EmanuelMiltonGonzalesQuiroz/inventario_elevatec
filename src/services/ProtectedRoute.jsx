import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return null; // O muestra un loader mientras carga el usuario
  }

  if (!currentUser) {
    console.log('Redirecting to /login because currentUser is null');
    return <Navigate to="/login" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
