import { instance } from '../../shared/api/axiosInstance';
import { apiRequest } from '../../shared/helpers/apiRequest';

function loginPatient(email, dni) {
  return apiRequest(() =>
    instance.post('api/auth/patient/login', { email, dni: Number(dni) })
  );
}

export { loginPatient };
