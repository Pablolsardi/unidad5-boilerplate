import { useEffect, useState } from 'react';
import { getSpecialties } from '../services/specialtiesService';

// Una especialidad por id. El contrato no tiene GET /specialties/{id},
// así que se busca dentro del listado.
function useSpecialty(id) {
  const [specialty, setSpecialty] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const { data, error } = await getSpecialties({
        pageIndex: 1,
        pageSize: 100,
      });

      const found = data?.data?.find((s) => s.id === id);

      if (error || !found) setError('No se encontró la especialidad.');
      else setSpecialty(found);

      setLoading(false);
    };

    load();
  }, [id]);

  return { specialty, loading, error };
}

export default useSpecialty;
