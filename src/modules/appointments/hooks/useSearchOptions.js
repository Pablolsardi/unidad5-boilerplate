import { useEffect, useState } from 'react';
import { getSpecialties } from '../../specialties/services/specialtiesService';
import { getDoctors } from '../../doctors/services/doctorsService';

function useSearchOptions() {
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [specialtiesRes, doctorsRes] = await Promise.all([
        getSpecialties({ pageSize: 100 }),
        getDoctors({ pageSize: 100 }),
      ]);

      setSpecialties(specialtiesRes.data?.data ?? []);
      setDoctors(doctorsRes.data?.data ?? []);
    };

    load();
  }, []);

  const doctorsBySpecialty = (specialtyId) =>
    specialtyId
      ? doctors.filter((d) => d.specialty?.id === specialtyId)
      : doctors;

  const specialtyName = (id) => specialties.find((s) => s.id === id)?.name;

  const doctorName = (id) => doctors.find((d) => d.id === id)?.name;

  return {
    specialties,
    doctors,
    doctorsBySpecialty,
    specialtyName,
    doctorName,
  };
}

export default useSearchOptions;
