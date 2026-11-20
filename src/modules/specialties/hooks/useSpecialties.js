import { useCallback, useEffect, useState } from 'react';
import { getSpecialties } from '../services/specialtiesService';

// Página de especialidades desde la API, con estados de carga y error.
function useSpecialties({ page = 1, pageSize = 10, name = '' } = {}) {
  const [specialties, setSpecialties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');

    const { data, error } = await getSpecialties({
      pageIndex: page,
      pageSize,
      name,
    });

    if (error) {
      setError(error.message);
      setSpecialties([]);
      setTotal(0);
    } else {
      setSpecialties(data.data);
      setTotal(data.total);
    }

    setLoading(false);
  }, [page, pageSize, name]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { specialties, total, loading, error, reload };
}

export default useSpecialties;
