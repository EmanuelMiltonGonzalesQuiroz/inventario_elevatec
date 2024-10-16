import React from 'react';
import ReactDOM from 'react-dom/client';  // Cambia a 'react-dom/client'
import './index.css';
import App from './App';  // Importa tu componente principal
import { AuthProvider } from './context/AuthContext'; // Asegúrate de importar AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
