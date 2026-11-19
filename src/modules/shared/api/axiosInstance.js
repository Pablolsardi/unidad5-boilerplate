import axios from 'axios';

const instance = axios.create({
  baseURL: '/',
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const esLogin = url?.includes('login');

    if (status === 401 && !esLogin) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('dni');

      if (window.location.pathname.includes('admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export { instance };
