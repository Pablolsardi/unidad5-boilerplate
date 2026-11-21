import { useForm } from 'react-hook-form';
import Button from '../../shared/components/Button';
import ErrorAlert from '../../shared/components/ErrorAlert';
import { formatLongDate } from '../helpers/dateHelpers';

const MIN_REASON_LENGTH = 5;

// Resumen del horario elegido + motivo + confirmar.
// El formulario es dueño de su propio estado (react-hook-form); hacia afuera
// solo avisa onSubmit(reason). Al reservar, PatientHome lo desmonta y se resetea solo.
function BookingForm({ slot, doctorName, error = '', onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { reason: '' } });

  return (
    <form
      onSubmit={handleSubmit(({ reason }) => onSubmit(reason))}
      className="bg-med-primary-50 border border-med-primary-200/60 rounded-2xl p-5 sm:p-6 flex flex-col gap-4"
      noValidate
    >
      <div className="border-l-4 border-med-primary-900 pl-3.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-med-text-sub">
          Resumen de Selección
        </span>
        <p className="text-base sm:text-lg font-bold text-med-primary-900 mt-0.5 flex items-center gap-2">
          <span aria-hidden="true">📅</span>
          <span className="first-letter:uppercase">
            {formatLongDate(slot.date)}, {slot.startTime} hs
          </span>
        </p>
        <p className="text-xs text-med-text-sub mt-0.5">
          {doctorName} • {slot.startTime} a {slot.endTime} hs
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="booking-reason"
          className="text-xs font-semibold text-med-text-main"
        >
          Motivo de la consulta
        </label>
        <textarea
          id="booking-reason"
          rows={3}
          placeholder="Ej: control anual, dolor de cabeza frecuente..."
          aria-invalid={Boolean(errors.reason)}
          className="w-full px-3.5 py-2.5 text-sm bg-white border border-med-border rounded-lg focus:outline-none focus:ring-2 focus:ring-med-primary-600"
          {...register('reason', {
            validate: (value) =>
              value.trim().length >= MIN_REASON_LENGTH ||
              `El motivo debe tener al menos ${MIN_REASON_LENGTH} caracteres.`,
          })}
        />
        {errors.reason && (
          <p className="text-xs text-med-danger-text">
            {errors.reason.message}
          </p>
        )}
      </div>

      <ErrorAlert>{error}</ErrorAlert>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="py-3 px-6 rounded-xl text-sm disabled:opacity-60"
        >
          {isSubmitting ? 'Reservando...' : 'Confirmar Turno'}
        </Button>
      </div>
    </form>
  );
}

export default BookingForm;
