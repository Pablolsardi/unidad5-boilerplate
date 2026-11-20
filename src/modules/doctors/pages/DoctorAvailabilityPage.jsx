import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import {
  getDoctors,
  getDoctorAvailabilities,
} from '../services/doctorsService';
import {
  DAYS,
  toHHmm,
  createAvailability,
  updateAvailability,
} from '../services/availabilityService';

const LIST_PATH = '/admin/doctors';
const DEFAULT_START = '08:00';
const DEFAULT_END = '12:00';

const DAY_LABELS = {
  LUNES: 'Lunes',
  MARTES: 'Martes',
  MIÉRCOLES: 'Miércoles',
  JUEVES: 'Jueves',
  VIERNES: 'Viernes',
  SÁBADO: 'Sábado',
  DOMINGO: 'Domingo',
};

// Detalles de VALIDATION_ERROR del back -> mensaje
const issueMessages = {
  required: 'Activá al menos un día.',
  invalid_day: 'Hay un día inválido.',
  must_be_before_endtime:
    'La hora de entrada debe ser anterior a la de salida.',
  must_be_multiple_of_30: 'Cada rango debe durar un múltiplo de 30 minutos.',
  overlapping_ranges: 'Hay rangos superpuestos en el mismo día.',
};

// Una fila por día de la semana, todas inactivas
const emptyWeek = () =>
  DAYS.map((day) => ({
    day,
    active: false,
    startTime: DEFAULT_START,
    endTime: DEFAULT_END,
  }));

// Reglas del back -> filas de la tabla (una por día)
function rulesToWeek(rules) {
  return emptyWeek().map((row) => {
    const rule = rules.find((r) => r.day === row.day);

    if (!rule) return row;

    return {
      ...row,
      active: true,
      startTime: toHHmm(rule.startTime),
      endTime: toHHmm(rule.endTime),
    };
  });
}

// "08:30" -> 510
function toMinutes(time) {
  const [h, m] = time.split(':').map(Number);

  return h * 60 + m;
}

// Devuelve el mensaje del primer problema encontrado o null
function validateWeek(activeDays) {
  if (activeDays.length === 0) return issueMessages.required;

  for (const d of activeDays) {
    const start = toMinutes(d.startTime);
    const end = toMinutes(d.endTime);

    if (start >= end)
      return `${DAY_LABELS[d.day]}: ${issueMessages.must_be_before_endtime}`;

    if ((end - start) % 30 !== 0)
      return `${DAY_LABELS[d.day]}: ${issueMessages.must_be_multiple_of_30}`;
  }

  return null;
}

function DoctorAvailabilityPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [hasRules, setHasRules] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { days: emptyWeek() } });

  // Para habilitar/deshabilitar las horas según el interruptor de cada día
  const days = useWatch({ control, name: 'days' });

  const doctor = doctors.find((d) => d.id === id);

  // Combo "Seleccionar Profesional"
  useEffect(() => {
    const loadDoctors = async () => {
      const { data } = await getDoctors({ pageIndex: 1, pageSize: 100 });

      if (data) setDoctors(data.data);
    };

    loadDoctors();
  }, []);

  const loadRules = useCallback(async () => {
    if (!id) {
      setLoading(false);

      return;
    }
    setLoading(true);
    setLoadError('');

    const { data, error } = await getDoctorAvailabilities(id);

    if (error) {
      setLoadError(
        error.code === 'ENTITY_NOTFOUND'
          ? 'El médico no existe o fue eliminado.'
          : error.message
      );
    } else {
      setHasRules(data.length > 0);
      reset({ days: rulesToWeek(data) });
    }

    setLoading(false);
  }, [id, reset]);

  useEffect(() => {
    setFormError('');
    setSuccess(null);
    loadRules();
  }, [loadRules]);

  const submit = async (values) => {
    setFormError('');
    setSuccess(null);

    const activeDays = values.days.filter((d) => d.active);
    const problem = validateWeek(activeDays);

    if (problem) {
      setFormError(problem);

      return;
    }

    const ranges = activeDays.map(({ day, startTime, endTime }) => ({
      day,
      startTime,
      endTime,
    }));

    // POST la primera vez; PUT si el médico ya tiene reglas este mes
    const save = hasRules ? updateAvailability : createAvailability;
    const { data, error } = await save(id, ranges);

    if (error) {
      const issues = [...new Set(error.details.map((d) => d.issue))]
        .map((issue) => issueMessages[issue])
        .filter(Boolean);

      setFormError(issues.length > 0 ? issues.join(' ') : error.message);

      return;
    }

    setSuccess(data);
    await loadRules();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado */}
      <div>
        <nav className="text-xs text-med-text-muted mb-2">
          <Link to={LIST_PATH} className="hover:text-med-primary-700">
            Doctores
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-med-text-main font-medium">
            Disponibilidad Horaria
          </span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Gestionar Disponibilidad Horaria
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Defina los días y rangos horarios de atención para el profesional
          seleccionado.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5 items-start">
        {/* Columna izquierda: profesional + nota */}
        <div className="flex flex-col gap-5">
          <Card className="border-med-border flex flex-col gap-4">
            <label
              htmlFor="availability-doctor"
              className="text-xs font-semibold text-med-text-main"
            >
              Seleccionar Profesional
            </label>
            <select
              id="availability-doctor"
              value={id ?? ''}
              onChange={(e) =>
                navigate(`/admin/doctors/${e.target.value}/availability`, {
                  replace: true,
                })
              }
              className="w-full border border-med-border rounded-lg px-3 py-2 text-sm bg-white text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600"
            >
              {!id && <option value="">Seleccione un profesional</option>}
              {id && !doctor && (
                <option value={id}>Cargando profesionales...</option>
              )}
            </select>

            {doctor && (
              <div className="flex items-center gap-3 rounded-lg bg-med-primary-50 p-3">
                <div className="w-12 h-12 rounded-xl bg-med-primary-100 text-med-primary-700 flex items-center justify-center shrink-0 text-lg font-bold">
                  {doctor.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-med-primary-900 leading-tight truncate">
                    {doctor.name}
                  </p>
                  <p className="text-xs text-med-text-sub mt-0.5">
                    Matrícula: {doctor.licenseNumber || '—'}
                  </p>
                  <p className="text-xs text-med-text-sub">
                    {doctor.specialty?.name ?? 'Sin especialidad'}
                  </p>
                </div>
              </div>
            )}
          </Card>

          <Card className="border-med-border">
            <div className="flex gap-2 text-xs text-med-text-sub">
              <svg
                className="w-4 h-4 shrink-0 text-med-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>
                Los cambios se aplican a los días que quedan del mes actual (se
                omiten los feriados). Los turnos ya reservados no se ven
                afectados.
              </p>
            </div>
          </Card>
        </div>

        {/* Columna derecha: configuración de horarios */}
        <Card className="p-0 overflow-hidden border-med-border">
          <div className="p-5 flex flex-wrap items-center justify-between gap-2 border-b border-med-border">
            <h2 className="text-base font-bold text-med-primary-900">
              Configuración de Horarios
            </h2>
            <span className="text-xs text-med-text-muted">
              ⏱ Intervalos automáticos de 30 minutos
            </span>
          </div>

          {id && loading && (
            <p className="p-8 text-center text-sm text-med-text-muted">
              Cargando disponibilidad...
            </p>
          )}

          {!id && (
            <p className="p-8 text-center text-sm text-med-text-muted">
              Seleccione un profesional para ver y configurar sus horarios.
            </p>
          )}

          {id && !loading && !loadError && (
            <form onSubmit={handleSubmit(submit)} noValidate>
              {(success || formError) && (
                <div className="px-5 pt-5">
                  {success && (
                    <p className="rounded-lg bg-med-active-bg px-4 py-3 text-sm text-med-active-text">
                      Disponibilidad guardada para {success.month}/
                      {success.year}. Se generaron {success.slotsGenerated}{' '}
                      turnos nuevos.
                    </p>
                  )}
                  {formError && (
                    <p className="rounded-lg bg-med-danger-bg px-4 py-3 text-sm text-med-danger-text">
                      {formError}
                    </p>
                  )}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
                    <tr>
                      <th className="px-5 py-3">Día</th>
                      <th className="px-5 py-3">Estado</th>
                      <th className="px-5 py-3">Entrada</th>
                      <th className="px-5 py-3">Salida</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-med-border-subtle">
                    {DAYS.map((day, index) => {
                      const active = days?.[index]?.active;

                      return (
                        <tr key={day} className={active ? '' : 'bg-gray-50/60'}>
                          <td
                            className={`px-5 py-3 font-medium ${
                              active
                                ? 'text-med-text-main'
                                : 'text-med-text-muted'
                            }`}
                          >
                            {DAY_LABELS[day]}
                          </td>
                          <td className="px-5 py-3">
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                aria-label={`Atiende los ${DAY_LABELS[day]}`}
                                {...register(`days.${index}.active`)}
                              />
                              <span className="relative w-9 h-5 rounded-full bg-gray-300 transition peer-checked:bg-med-primary-600 peer-focus-visible:ring-2 peer-focus-visible:ring-med-primary-600 after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4" />
                              <span
                                className={`text-xs font-medium ${
                                  active
                                    ? 'text-med-primary-700'
                                    : 'text-med-text-muted'
                                }`}
                              >
                                {active ? 'Activo' : 'Inactivo'}
                              </span>
                            </label>
                          </td>
                          <td className="px-5 py-3">
                            <input
                              type="time"
                              step={1800}
                              disabled={!active}
                              aria-label={`Entrada ${DAY_LABELS[day]}`}
                              className="border border-med-border rounded-lg px-2.5 py-1.5 text-sm bg-white text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 disabled:bg-gray-100 disabled:text-med-text-muted"
                              {...register(`days.${index}.startTime`)}
                            />
                          </td>
                          <td className="px-5 py-3">
                            <input
                              type="time"
                              step={1800}
                              disabled={!active}
                              aria-label={`Salida ${DAY_LABELS[day]}`}
                              className="border border-med-border rounded-lg px-2.5 py-1.5 text-sm bg-white text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 disabled:bg-gray-100 disabled:text-med-text-muted"
                              {...register(`days.${index}.endTime`)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-5 flex justify-end gap-2 border-t border-med-border">
                <Button
                  variant="outline"
                  onClick={() => navigate(LIST_PATH)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Guardar Disponibilidad'}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

export default DoctorAvailabilityPage;
