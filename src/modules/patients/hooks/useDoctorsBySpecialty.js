import { useEffect, useState } from 'react';
import { getDoctors } from '../../doctors/services/doctorsService';

const MAX_DOCTORS = 100;

// Médicos de una especialidad. Sin especialidad elegida devuelve lista vacía
// (no pide nada). El flag `ignore` descarta respuestas viejas si el usuario
// cambia de especialidad antes de que vuelva la anterior.
function useDoctorsBySpecialty(specialtyId) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setDoctors([]);
    setError('');

    if (!specialtyId) {
      setLoading(false);

      return;
    }

    let ignore = false;

    const load = async () => {
      setLoading(true);

      const { data, error } = await getDoctors({
        specialtyId,
        pageSize: MAX_DOCTORS,
      });

      if (ignore) return;

      setLoading(false);

      if (error) {
        setError(error.message);

        return;
      }

      setDoctors(data.data);
    };

    load();

    return () => {
      ignore = true;
    };
  }, [specialtyId]);

  return { doctors, loading, error };
}

export default useDoctorsBySpecialty;
