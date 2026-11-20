import { useEffect, useState } from 'react';
import { getDoctors } from '../services/doctorsService';

// Un médico por id. El contrato no tiene GET /doctors/{id},
// así que se busca dentro del listado.
function useDoctor(id) {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const { data, error } = await getDoctors({ pageIndex: 1, pageSize: 100 });

      const found = data?.data?.find((d) => d.id === id);

      if (error || !found) setError('No se encontró el médico.');
      else setDoctor(found);

      setLoading(false);
    };

    load();
  }, [id]);

  return { doctor, loading, error };
}

export default useDoctor;
