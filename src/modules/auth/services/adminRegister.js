import { instance } from '../../shared/api/axiosInstance';
import { apiRequest } from '../../shared/helpers/apiRequest';

function registerAdmin({ email, password }) {
  return apiRequest(() =>
    instance.post('api/auth/admin/register', { email, password })
  );
}

export { registerAdmin };