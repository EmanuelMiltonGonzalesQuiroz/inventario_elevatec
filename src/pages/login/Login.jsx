import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { validateUserCredentials } from '../../services/auth';
import { loginText } from '../../components/common/Text/texts';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdAttachEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import logo from '../../assets/images/COTA LOGO/elevatec_logo_sin_fondo.png'; // Importar el logo
import fondo from '../../assets/images/fondo.jpg'; // Importar la imagen de fondo

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    setError('');
    if (email === '' || password === '') {
      setError(loginText.validationError);
      return;
    }

    try {
      const { success, userData } = await validateUserCredentials(email, password);
      if (success && userData) {
        login(userData); // Guardar los datos del usuario
        window.location.href = '/dashboard';
      } else {
        setError(loginText.loginError);
      }
    } catch (err) {
      setError('Hubo un error al intentar iniciar sesión.');
    }
  };

  const handleKeyDown = (event, nextField) => {
    if (event.key === 'Enter') {
      if (nextField) {
        nextField.focus(); // Enfocar el siguiente campo
      } else {
        handleLogin(); // Si es el último campo, ejecutar la función de login
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-16" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{loginText.title}</h2>
        <LoginFields
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          error={error}
          handleLogin={handleLogin}
          handleKeyDown={handleKeyDown} // Pasamos la función handleKeyDown a los campos
        />
      </div>
    </div>
  );
};

const LoginFields = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  error,
  handleLogin,
  handleKeyDown,
}) => {
  let passwordInputRef = null; // Referencia para el campo de contraseña

  return (
    <>
      <div className="mb-4 relative">
        <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
          {loginText.emailPlaceholder}
        </label>
        <div className="flex items-center border rounded bg-gray-100 overflow-hidden">
          <MdAttachEmail className="text-gray-500 ml-3" size={24} />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={loginText.emailPlaceholder}
            className="flex-1 p-3 bg-transparent text-black focus:outline-none"
            onKeyDown={(e) => handleKeyDown(e, passwordInputRef)}
          />
        </div>
      </div>
      <div className="mb-4 relative">
        <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
          {loginText.passwordPlaceholder}
        </label>
        <div className="flex items-center border rounded bg-gray-100 overflow-hidden">
          <RiLockPasswordLine className="text-gray-500 ml-3" size={24} />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={loginText.passwordPlaceholder}
            className="flex-1 p-3 bg-transparent text-black focus:outline-none"
            ref={(input) => (passwordInputRef = input)}
            onKeyDown={(e) => handleKeyDown(e, null)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="mr-3 text-gray-600 focus:outline-none"
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
      >
        {loginText.button}
      </button>
    </>
  );
};

export default LoginForm;
