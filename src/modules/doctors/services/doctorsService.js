import { instance } from '../../shared/api/axiosInstance';
import { apiRequest } from '../../shared/helpers/apiRequest';

const BASE_URL = 'api/doctors';

function getDoctors({ pageIndex = 1, pageSize = 10, name, specialtyId } = {}) {
  const params = { pageIndex, pageSize };

  if (name?.trim()) params.name = name.trim();

  if (specialtyId) params.specialtyId = specialtyId; // requiere back 4.2 (C)

  return apiRequest(() => instance.get(BASE_URL, { params }));
}

function createDoctor({ name, licenseNumber, specialtyId }) {
  return apiRequest(() =>
    instance.post(BASE_URL, { name, licenseNumber, specialtyId })
  );
}

function updateDoctor(id, { name, licenseNumber, specialtyId }) {
  return apiRequest(() =>
    instance.put(`${BASE_URL}/${id}`, { name, licenseNumber, specialtyId })
  );
}

function deleteDoctor(id) {
  return apiRequest(() => instance.delete(`${BASE_URL}/${id}`));
}

function getDoctorAvailabilities(id) {
  return apiRequest(() => instance.get(`${BASE_URL}/${id}/availabilities`));
}

function getDoctorSlots(id, date) {
  const params = date ? { date } : {};

  return apiRequest(() => instance.get(`${BASE_URL}/${id}/slots`, { params }));
}

export {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorAvailabilities,
  getDoctorSlots,
};
