import { instance } from '../../shared/api/axiosInstance';
import { apiRequest } from '../../shared/helpers/apiRequest';

const BASE_URL = 'api/appointments/search';

function searchAppointments({
  pageIndex = 1,
  pageSize = 10,
  specialtyId,
  doctorId,
  dni,
  date,
} = {}) {
  const params = { pageIndex, pageSize };

  if (specialtyId) params.specialtyId = specialtyId;

  if (doctorId) params.doctorId = doctorId;

  if (dni?.trim()) params.dni = dni.trim();

  if (date) params.date = date;

  return apiRequest(() => instance.get(BASE_URL, { params }));
}

export { searchAppointments };
