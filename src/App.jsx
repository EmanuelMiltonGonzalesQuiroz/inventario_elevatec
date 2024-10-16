import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import Home from './pages/Home/Home'; // Asegúrate de que la ruta es correcta
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './services/ProtectedRoute'; // Importa el componente ProtectedRoute

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={Home} />} // Protege la ruta del dashboard
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
