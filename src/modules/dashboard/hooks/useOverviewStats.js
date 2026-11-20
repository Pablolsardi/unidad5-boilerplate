import { useEffect, useState } from 'react';
import { getDoctors } from '../../doctors/services/doctorsService';
import { getSpecialties } from '../../specialties/services/specialtiesService';
import { getTodayAppointmentsCount } from '../services/dashboardService';

function useOverviewStats() {
  const [stats, setStats] = useState({
    doctors: null,
    specialties: null,
    appointmentsToday: null,
  });

  useEffect(() => {
    const load = async () => {
      const [doctorsRes, specialtiesRes, appointmentsRes] = await Promise.all([
        getDoctors({ pageIndex: 1, pageSize: 1 }),
        getSpecialties({ pageIndex: 1, pageSize: 1 }),
        getTodayAppointmentsCount(),
      ]);

      setStats({
        doctors: doctorsRes.data?.total ?? null,
        specialties: specialtiesRes.data?.total ?? null,
        appointmentsToday: appointmentsRes.data?.total ?? null,
      });
    };

    load();
  }, []);

  return stats;
}

export default useOverviewStats;
