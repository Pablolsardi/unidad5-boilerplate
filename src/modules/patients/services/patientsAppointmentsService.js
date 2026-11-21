import { instance } from '../../shared/api/axiosInstance';
import { apiRequest } from '../../shared/helpers/apiRequest';

const BASE_URL = 'api/appointments';

// El servicio no sabe de dónde sale el DNI (sesión, localStorage, etc.):
// lo recibe como parámetro desde quien lo llama (useAuth).
function getMyAppointments(dni) {
  return apiRequest(() =>
    instance.get(`${BASE_URL}/patient`, {
      params: { dni: Number(dni) },
    })
  );
}

function createAppointment({ doctorId, slotId, reason, dni }) {
  return apiRequest(() =>
    instance.post(BASE_URL, {
      doctorId,
      availabilitySlotId: slotId,
      patient: { dni: Number(dni) },
      reason: reason.trim(),
    })
  );
}

function cancelAppointment(id) {
  return apiRequest(() => instance.delete(`${BASE_URL}/${id}`));
}

export { getMyAppointments, createAppointment, cancelAppointment };
