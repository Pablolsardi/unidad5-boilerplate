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

  const singout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setRole(null);
    setEmail(null);
  };

  const setAuthSession = (token, role, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('email', email);
    setIsAuthenticated(true);
    setRole(role);
    setEmail(email);
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

    setAuthSession(data.token, data.role, email);
    localStorage.setItem('dni', dni);
    localStorage.setItem('email', email);

    return { error: null }; 
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        email,
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
