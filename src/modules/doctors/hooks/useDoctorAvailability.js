import { useCallback, useEffect, useState } from 'react';
import { getDoctorAvailabilities } from '../services/doctorsService';
import {
  createAvailability,
  updateAvailability,
} from '../services/availabilityService';

function useDoctorAvailability(id) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    if (!id) {
      setLoading(false);

      return;
    }

    setLoading(true);
    setError('');

    const { data, error } = await getDoctorAvailabilities(id);

    if (error) {
      setError(
        error.code === 'ENTITY_NOTFOUND'
          ? 'El médico no existe o fue eliminado.'
          : error.message
      );
      setRules([]);
    } else {
      setRules(data);
    }

    setLoading(false);
  }, [id]);

  useEffect(() => {
    reload();
  }, [reload]);

  // POST la primera vez; PUT si el médico ya tiene reglas este mes
  const save = async (ranges) => {
    const send = rules.length > 0 ? updateAvailability : createAvailability;
    const result = await send(id, ranges);

    if (!result.error) await reload();

    return result;
  };

  return { rules, loading, error, save };
}

export default useDoctorAvailability;
