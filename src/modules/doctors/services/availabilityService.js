import { instance } from '../../shared/api/axiosInstance';
import { apiRequest } from '../../shared/helpers/apiRequest';

const BASE_URL = 'api/availabilities';

const DAYS = [
  'LUNES',
  'MARTES',
  'MIÉRCOLES',
  'JUEVES',
  'VIERNES',
  'SÁBADO',
  'DOMINGO',
];

function toTimeOnly(time) {
  const [h = '0', m = '0'] = String(time).split(':');

  return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:00`;
}

function toHHmm(time) {
  return String(time ?? '').slice(0, 5);
}

function buildPayload(doctorId, days) {
  return {
    doctorId,
    days: days.map(({ day, startTime, endTime }) => ({
      day,
      startTime: toTimeOnly(startTime),
      endTime: toTimeOnly(endTime),
    })),
  };
}

function createAvailability(doctorId, days) {
  return apiRequest(() =>
    instance.post(BASE_URL, buildPayload(doctorId, days))
  );
}

function updateAvailability(doctorId, days) {
  return apiRequest(() => instance.put(BASE_URL, buildPayload(doctorId, days)));
}

export { DAYS, toHHmm, createAvailability, updateAvailability };
