import React from 'react';
import logo from '../../assets/images/COTA LOGO/elevatec_logo_sin_fondo.png';
import { useAuth } from '../../context/AuthContext';
import { homeText } from '../../components/common/Text/texts';

const Header = () => {
  const { logout } = useAuth();
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userEmail = user ? user.email : 'No email available';

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="bg-gradient-to-r from-orange-500 to-brown-700 text-white flex justify-between items-center p-4 max-h-[10vh]">
      <img src={logo} alt="Logo" className="w-32" />
      <div className="flex items-center">
        <span className="mr-4 font-semibold">{userEmail}</span>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-800 transition"
        >
          {homeText.logoutButton}
        </button>
      </div>
    </header>
  );
};

export default Header;
