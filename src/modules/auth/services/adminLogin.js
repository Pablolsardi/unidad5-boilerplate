import { instance } from '../../shared/api/axiosInstance';
import { apiRequest } from '../../shared/helpers/apiRequest';

function loginAdmin(email, password) {
  return apiRequest(() =>
    instance.post('api/auth/admin/login', { email, password })
  );
}

export { loginAdmin };
