import { useCallback, useEffect, useState } from 'react';
import { getDoctorSlots } from '../../doctors/services/doctorsService';
import { isPastSlot } from '../helpers/dateHelpers';

// Horarios libres (y futuros) de un médico. `reload` vuelve a pedirlos,
// por ejemplo después de reservar o si el turno elegido ya fue tomado.
function useDoctorSlots(doctorId) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setSlots([]);
    setError('');

    if (!doctorId) {
      setLoading(false);

      return;
    }

    let ignore = false;

    const load = async () => {
      setLoading(true);

      const { data, error } = await getDoctorSlots(doctorId);

      if (ignore) return;

      setLoading(false);

      if (error) {
        setError(error.message);

        return;
      }

      setSlots(data.filter((slot) => !isPastSlot(slot)));
    };

    load();

    return () => {
      ignore = true;
    };
  }, [doctorId, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { slots, loading, error, reload };
}

export default useDoctorSlots;
