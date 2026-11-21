import Button from '../../shared/components/Button';
import { formatLongDate } from '../helpers/dateHelpers';

// Modal de éxito con los datos que devolvió el back al crear el turno.
function BookingConfirmedModal({
  appointment,
  dni,
  onViewAppointments,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-confirmed-title"
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center"
      >
        <div
          aria-hidden="true"
          className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold"
        >
          ✓
        </div>
        <h3
          id="booking-confirmed-title"
          className="text-xl font-bold text-med-primary-900"
        >
          ¡Turno confirmado!
        </h3>
        <p className="text-xs text-med-text-sub mt-2 leading-relaxed">
          Tu turno con{' '}
          <strong className="text-med-text-main">{appointment.doctor}</strong>{' '}
          quedó reservado para el{' '}
          <strong className="text-med-text-main">
            {formatLongDate(appointment.date)} a las{' '}
            {appointment.startTime.slice(0, 5)} hs
          </strong>
          .
        </p>

        <div className="mt-5 p-3.5 bg-med-primary-50 border border-med-primary-200/60 rounded-xl text-xs text-med-primary-900 text-left space-y-1">
          <p>
            <strong>Especialidad:</strong> {appointment.speciality ?? '-'}
          </p>
          <p>
            <strong>Motivo:</strong> {appointment.reason}
          </p>
          <p>
            <strong>DNI del paciente:</strong> {dni}
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            className="w-full text-xs py-2.5"
            onClick={onViewAppointments}
          >
            Ver Mis Turnos
          </Button>
          <Button
            variant="secondary"
            className="w-full text-xs py-2.5"
            onClick={onClose}
          >
            Reservar Otro
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmedModal;
