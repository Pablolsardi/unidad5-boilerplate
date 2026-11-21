import { useState } from 'react';
import useAuth from '../../auth/hook/useAuth';
import { createAppointment } from '../services/appointmentsService';

// Errores que significan "ese horario ya no sirve": hay que recargar los horarios
const SLOT_ERRORS = ['APPOINTMENT_CONFLICT', 'APPOINTMENT_PAST_DATE'];

// Reserva de turno para el paciente logueado. El DNI sale de la sesión (useAuth).
function useBookAppointment() {
  const { dni } = useAuth();
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(null);

  // Devuelve { ok, slotUnavailable } para que la página decida qué hacer
  const book = async ({ doctorId, slotId, reason }) => {
    setError('');

    const { data, error } = await createAppointment({
      doctorId,
      slotId,
      reason,
      dni,
    });

    if (error) {
      setError(error.message);

      return { ok: false, slotUnavailable: SLOT_ERRORS.includes(error.code) };
    }

    setConfirmed(data);

    return { ok: true, slotUnavailable: false };
  };

  return {
    book,
    error,
    clearError: () => setError(''),
    confirmed,
    closeConfirmation: () => setConfirmed(null),
  };
}

export default useBookAppointment;
