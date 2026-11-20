import { instance } from '../../shared/api/axiosInstance';
import { apiRequest } from '../../shared/helpers/apiRequest';

const BASE_URL = 'api/appointments';

function getSessionDni() {
  return Number(localStorage.getItem('dni'));
}

function getMyAppointments() {
  return apiRequest(() =>
    instance.get(`${BASE_URL}/patient`, {
      params: { dni: getSessionDni() },
    })
  );
}

function createAppointment({ doctorId, slotId, reason }) {
  return apiRequest(() =>
    instance.post(BASE_URL, {
      doctorId,
      availabilitySlotId: slotId,
      patient: { dni: getSessionDni() },
      reason: reason.trim(),
    })
  );
}

function cancelAppointment(id) {
  return apiRequest(() => instance.delete(`${BASE_URL}/${id}`));
}

export {
  getSessionDni,
  getMyAppointments,
  createAppointment,
  cancelAppointment,
};
