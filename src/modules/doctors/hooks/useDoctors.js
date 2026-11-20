import { useCallback, useEffect, useState } from 'react';
import { getDoctors } from '../services/doctorsService';

// Página de médicos desde la API, filtrable por nombre y especialidad.
function useDoctors({
  page = 1,
  pageSize = 10,
  name = '',
  specialtyId = '',
} = {}) {
  const [doctors, setDoctors] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');

    const { data, error } = await getDoctors({
      pageIndex: page,
      pageSize,
      name,
      specialtyId,
    });

    if (error) {
      setError(error.message);
      setDoctors([]);
      setTotal(0);
    } else {
      setDoctors(data.data);
      setTotal(data.total);
    }

    setLoading(false);
  }, [page, pageSize, name, specialtyId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { doctors, total, loading, error, reload };
}

export default useDoctors;
