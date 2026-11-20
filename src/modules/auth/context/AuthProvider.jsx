import { createContext, useState } from 'react';
import { loginAdmin } from '../services/adminLogin';
import { loginPatient } from '../services/patientLogin';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    return Boolean(token && role);
  });

  const [role, setRole] = useState(() => localStorage.getItem('role'));
  const [email, setEmail] = useState(() => localStorage.getItem('email'));
  const [dni, setDni] = useState(() => localStorage.getItem('dni'));

  const singout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setRole(null);
    setEmail(null);
    setDni(null);
  };

  const setAuthSession = (token, role, email, dni = null) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('email', email);

    if (dni) localStorage.setItem('dni', dni);

    setIsAuthenticated(true);
    setRole(role);
    setEmail(email);
    setDni(dni);
  };

  const singinAdmin = async (email, password) => {
    const { data, error } = await loginAdmin(email, password);

    if (error) {
      return { error };
    }

    setAuthSession(data.token, data.role, email);

    return { error: null };
  };

  const singinPatient = async (email, dni) => {
    const { data, error } = await loginPatient(email, dni);

    if (error) {
      return { error };
    }

    setAuthSession(data.token, data.role, email, dni);

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        email,
        dni,
        singinAdmin,
        singinPatient,
        singout,
        setAuthSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
