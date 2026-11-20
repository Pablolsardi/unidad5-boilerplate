import { instance } from '../../shared/api/axiosInstance';
import { apiRequest } from '../../shared/helpers/apiRequest';

function todayLocal() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${now.getFullYear()}-${month}-${day}`;
}

function getTodayAppointmentsCount() {
  return apiRequest(() =>
    instance.get('api/appointments', {
      params: { date: todayLocal(), pageIndex: 1, pageSize: 1 },
    })
  );
}

export { todayLocal, getTodayAppointmentsCount };
