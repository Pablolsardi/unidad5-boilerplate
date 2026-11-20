import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { getSpecialties } from '../../specialties/services/specialtiesService';
import {
  getDoctors,
  getDoctorSlots,
} from '../../doctors/services/doctorsService';
import {
  addDays,
  formatLongDate,
  formatWeekRange,
  getDayName,
  getMonthName,
  getWeekDates,
  groupSlotsByDate,
  isPastSlot,
  parseDate,
  startOfWeek,
} from '../helpers/dateHelpers';
import {
  createAppointment,
  getSessionDni,
} from '../services/appointmentsService';

// Errores que significan "ese horario ya no sirve": hay que recargar los horarios
const SLOT_ERRORS = ['APPOINTMENT_CONFLICT', 'APPOINTMENT_PAST_DATE'];

function PatientHome() {
  const navigate = useNavigate();

  const [specialties, setSpecialties] = useState([]);
  const [specialtyId, setSpecialtyId] = useState('');

  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      const { data, error } = await getSpecialties({ pageSize: 100 });

      if (ignore) return;

      if (error) {
        setLoadError(error.message);

        return;
      }

      setSpecialties(data.data);
    };

    load();

    return () => {
      ignore = true;
    };
  }, []);

  // Cada vez que cambia la especialidad: traer sus médicos
  useEffect(() => {
    if (!specialtyId) return;

    let ignore = false;

    const load = async () => {
      setLoadingDoctors(true);
      const { data, error } = await getDoctors({ specialtyId, pageSize: 100 });

      if (ignore) return;

      setLoadingDoctors(false);

      if (error) {
        setLoadError(error.message);

        return;
      }

      setDoctors(data.data);
    };

    load();

    return () => {
      ignore = true;
    };
  }, [specialtyId]);

  const handleSpecialtyChange = (e) => {
    setSpecialtyId(e.target.value);
    setDoctors([]);
    setDoctorId('');
    setSlots([]);
    setSelectedSlot(null);
    setLoadError('');
    setSubmitError('');
  };

  // El médico elegido (undefined si todavía no eligió ninguno)
  const currentDoctor = doctors.find((doc) => doc.id === doctorId);

  // Horarios libres del médico elegido (vienen de la API)
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reloadSlots, setReloadSlots] = useState(0);
  const [submitError, setSubmitError] = useState('');
  const [confirmed, setConfirmed] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { reason: '' } });

  // cargar los horarios libres al cambiar de medico
  useEffect(() => {
    if (!doctorId) return;

    let ignore = false;

    const load = async () => {
      setLoadingSlots(true);
      const { data, error } = await getDoctorSlots(doctorId);

      if (ignore) return;

      setLoadingSlots(false);

      if (error) {
        setLoadError(error.message);

        return;
      }

      const futureSlots = data.filter((slot) => !isPastSlot(slot));

      setSlots(futureSlots);

      if (futureSlots.length > 0) {
        setWeekStart(startOfWeek(parseDate(futureSlots[0].date)));
        setSelectedDate(futureSlots[0].date);
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [doctorId, reloadSlots]);

  const slotsByDate = groupSlotsByDate(slots);
  const weekDates = getWeekDates(weekStart);
  const canGoBack = weekStart > startOfWeek(new Date());

  const handleDoctorChange = (e) => {
    setDoctorId(e.target.value);
    setSlots([]);
    setSelectedSlot(null);
    setLoadError('');
    setSubmitError('');
  };

  const handleChangeWeek = (direction) => {
    const newStart = addDays(weekStart, direction * 7);
    const firstDayWithSlots = getWeekDates(newStart).find(
      (date) => slotsByDate[date]?.length > 0
    );

    setWeekStart(newStart);
    setSelectedDate(firstDayWithSlots ?? '');
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setSelectedDate(slot.date);
    setSubmitError('');
  };

  const onSubmit = async ({ reason }) => {
    setSubmitError('');

    const { data, error } = await createAppointment({
      doctorId,
      slotId: selectedSlot.id,
      reason,
    });

    if (error) {
      setSubmitError(error.message);

      // Si el horario ya no está disponible, lo deseleccionamos y recargamos
      if (SLOT_ERRORS.includes(error.code)) {
        setSelectedSlot(null);
        setReloadSlots((n) => n + 1);
      }

      return;
    }

    // Reserva OK: mostramos el modal y recargamos (ese horario desaparece)
    setConfirmed(data);
    setSelectedSlot(null);
    reset();
    setReloadSlots((n) => n + 1);
  };

  // boton de horario
  const renderSlotButton = (slot) => {
    const isSelected = selectedSlot?.id === slot.id;

    return (
      <button
        key={slot.id}
        type="button"
        onClick={() => handleSelectSlot(slot)}
        className={`w-full py-2 px-2 text-xs font-semibold rounded-lg border transition-all text-center ${
          isSelected
            ? 'bg-emerald-400 text-white border-emerald-400 shadow-sm'
            : 'bg-white border-med-border text-med-primary-900 hover:border-med-primary-600 hover:bg-med-primary-50/50'
        }`}
      >
        {slot.startTime}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* 1. Card Superior: Selector de Especialidad y Doctor */}
      <Card className="p-6 sm:p-7">
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-primary-900">
            Reservar Turno Médico
          </h1>
          <p className="text-xs sm:text-sm text-med-text-sub mt-1">
            Seleccione la especialidad y el profesional para continuar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Especialidad */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Seleccionar Especialidad
            </label>
            <div className="relative">
              <select
                value={specialtyId}
                onChange={handleSpecialtyChange}
                className="w-full appearance-none px-3.5 py-2.5 text-sm bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 pr-10 cursor-pointer"
              >
                <option value="">Elegí una especialidad</option>
                {specialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name}
                  </option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-med-text-muted">
                ▼
              </span>
            </div>
          </div>

          {/* Doctor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Seleccionar Doctor
            </label>
            <div className="relative">
              <select
                value={doctorId}
                onChange={handleDoctorChange}
                disabled={!specialtyId || loadingDoctors}
                className="w-full appearance-none px-3.5 py-2.5 text-sm bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 pr-10 cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {loadingDoctors ? 'Cargando médicos...' : 'Elegí un médico'}
                </option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-med-text-muted">
                ▼
              </span>
            </div>
          </div>
        </div>

        {loadError && (
          <p className="mt-4 rounded-lg bg-med-danger-bg px-3 py-2 text-xs text-med-danger-text">
            {loadError}
          </p>
        )}
      </Card>

      {/* 2. Datos del médico elegido (solo si eligió uno) */}
      {currentDoctor && (
        <Card className="p-5 sm:p-6 flex items-center gap-4 border-med-border">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-med-primary-100 flex items-center justify-center text-3xl border border-med-primary-200 shrink-0">
            🩺
          </div>

          <div className="overflow-hidden">
            <h2 className="text-base sm:text-lg font-bold text-med-primary-900">
              {currentDoctor.name}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-med-primary-700 mt-0.5">
              {currentDoctor.specialty?.name}
            </p>
            {currentDoctor.licenseNumber && (
              <p className="text-xs text-med-text-muted mt-0.5">
                Matrícula: {currentDoctor.licenseNumber}
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Mientras no haya médico elegido, mostramos una ayuda */}
      {!currentDoctor && (
        <Card className="p-8 text-center border-dashed">
          <p className="text-sm text-med-text-sub">
            Elegí una especialidad y un médico para ver los horarios
            disponibles.
          </p>
        </Card>
      )}

      {/* 3. Calendario semanal con los horarios reales */}
      {currentDoctor && (
        <Card className="p-5 sm:p-6 border-med-border">
          {loadingSlots && (
            <p className="py-10 text-center text-sm text-med-text-sub">
              Cargando horarios...
            </p>
          )}

          {!loadingSlots && slots.length === 0 && (
            <p className="py-10 text-center text-sm text-med-text-sub">
              Este médico no tiene turnos disponibles por ahora.
            </p>
          )}

          {!loadingSlots && slots.length > 0 && (
            <>
              {/* Cabecera: navegación entre semanas */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-med-border-subtle">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Semana anterior"
                    onClick={() => handleChangeWeek(-1)}
                    disabled={!canGoBack}
                    className="px-2 py-1 rounded-md border border-med-border hover:bg-gray-50 text-med-text-sub transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ‹
                  </button>
                  <span className="font-bold text-sm sm:text-base text-med-primary-900">
                    {formatWeekRange(weekStart)}
                  </span>
                  <button
                    type="button"
                    aria-label="Semana siguiente"
                    onClick={() => handleChangeWeek(1)}
                    className="px-2 py-1 rounded-md border border-med-border hover:bg-gray-50 text-med-text-sub transition"
                  >
                    ›
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs text-med-text-sub">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-med-primary-900" />
                    Disponible
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Seleccionado
                  </span>
                </div>
              </div>

              {/* A) Desktop: una columna por día */}
              <div className="hidden sm:grid sm:grid-cols-7 gap-3 pt-5">
                {weekDates.map((date) => {
                  const daySlots = slotsByDate[date] ?? [];

                  return (
                    <div
                      key={date}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="text-center">
                        <span className="text-[11px] font-bold text-med-text-sub uppercase">
                          {getDayName(date)}
                        </span>
                        <p className="text-xl font-bold text-med-primary-900 leading-tight">
                          {parseDate(date).getDate()}
                        </p>
                      </div>

                      <div className="w-full flex flex-col gap-2">
                        {daySlots.length > 0 ? (
                          daySlots.map(renderSlotButton)
                        ) : (
                          <p className="py-6 text-center text-[11px] text-med-text-muted">
                            Sin turnos
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* B) Mobile: fila de días + horarios del día elegido */}
              <div className="block sm:hidden pt-4 space-y-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {weekDates.map((date) => {
                    const hasSlots = slotsByDate[date]?.length > 0;
                    const isActive = selectedDate === date;

                    return (
                      <button
                        key={date}
                        type="button"
                        disabled={!hasSlots}
                        onClick={() => setSelectedDate(date)}
                        className={`flex-1 min-w-[56px] py-2.5 px-2 rounded-xl text-center border transition-all disabled:opacity-40 ${
                          isActive
                            ? 'bg-med-primary-900 text-white border-med-primary-900 shadow-sm'
                            : 'bg-white border-med-border text-med-text-main'
                        }`}
                      >
                        <span className="block text-[10px] font-bold uppercase">
                          {getDayName(date)}
                        </span>
                        <span className="block text-base font-extrabold my-0.5">
                          {parseDate(date).getDate()}
                        </span>
                        <span className="block text-[10px] uppercase">
                          {getMonthName(date)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {slotsByDate[selectedDate]?.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {slotsByDate[selectedDate].map(renderSlotButton)}
                  </div>
                ) : (
                  <p className="p-6 bg-gray-50 border border-med-border rounded-xl text-center text-xs text-med-text-muted">
                    No hay turnos esta semana.
                  </p>
                )}
              </div>
            </>
          )}
        </Card>
      )}

      {/* Error al reservar cuando ya no hay horario elegido (ej: turno tomado) */}
      {submitError && !selectedSlot && (
        <p className="rounded-lg bg-med-danger-bg px-3 py-2 text-xs text-med-danger-text">
          {submitError}
        </p>
      )}

      {/* 4. Resumen + motivo + confirmar (solo si eligió un horario) */}
      {selectedSlot && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-med-primary-50 border border-med-primary-200/60 rounded-2xl p-5 sm:p-6 flex flex-col gap-4"
        >
          <div className="border-l-4 border-med-primary-900 pl-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-med-text-sub">
              Resumen de Selección
            </span>
            <p className="text-base sm:text-lg font-bold text-med-primary-900 mt-0.5 flex items-center gap-2">
              <span>📅</span>
              <span className="first-letter:uppercase">
                {formatLongDate(selectedSlot.date)}, {selectedSlot.startTime} hs
              </span>
            </p>
            <p className="text-xs text-med-text-sub mt-0.5">
              {currentDoctor?.name} • {selectedSlot.startTime} a{' '}
              {selectedSlot.endTime} hs
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reason"
              className="text-xs font-semibold text-med-text-sub"
            >
              Motivo de la consulta
            </label>
            <textarea
              id="reason"
              rows={3}
              placeholder="Ej: control anual, dolor de cabeza frecuente..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-med-border rounded-lg focus:outline-none focus:ring-2 focus:ring-med-primary-600"
              {...register('reason', {
                validate: (value) =>
                  value.trim().length >= 5 ||
                  'El motivo debe tener al menos 5 caracteres.',
              })}
            />
            {errors.reason && (
              <p className="text-xs text-med-danger-text">
                {errors.reason.message}
              </p>
            )}
          </div>

          {submitError && (
            <p className="rounded-lg bg-med-danger-bg px-3 py-2 text-xs text-med-danger-text">
              {submitError}
            </p>
          )}

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
      )}

      {/* Modal de turno confirmado (con los datos que devolvió el back) */}
      {confirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-med-primary-900">
              ¡Turno Confirmado con Éxito!
            </h3>
            <p className="text-xs text-med-text-sub mt-2 leading-relaxed">
              Tu turno con{' '}
              <strong className="text-med-text-main">{confirmed.doctor}</strong>{' '}
              quedó reservado para el{' '}
              <strong className="text-med-text-main">
                {formatLongDate(confirmed.date)} a las{' '}
                {confirmed.startTime.slice(0, 5)} hs
              </strong>
              .
            </p>

            <div className="mt-5 p-3.5 bg-med-primary-50 border border-med-primary-200/60 rounded-xl text-xs text-med-primary-900 text-left space-y-1">
              <p>
                <strong>Especialidad:</strong> {confirmed.speciality ?? '-'}
              </p>
              <p>
                <strong>Motivo:</strong> {confirmed.reason}
              </p>
              <p>
                <strong>DNI del paciente:</strong> {getSessionDni()}
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                className="w-full text-xs py-2.5"
                onClick={() => navigate('/appointments')}
              >
                Ver Mis Turnos
              </Button>
              <Button
                variant="secondary"
                className="w-full text-xs py-2.5"
                onClick={() => setConfirmed(null)}
              >
                Reservar Otro
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientHome;
