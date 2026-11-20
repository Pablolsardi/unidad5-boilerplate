import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useFieldArray, useForm } from 'react-hook-form';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { getDoctorAvailabilities } from '../services/doctorsService';
import {
  DAYS,
  toHHmm,
  createAvailability,
  updateAvailability,
} from '../services/availabilityService';

const LIST_PATH = '/admin/doctors';
const EMPTY_RANGE = { day: 'LUNES', startTime: '08:00', endTime: '12:00' };

const issueMessages = {
  required: 'Agregá al menos un rango horario.',
  invalid_day: 'Hay un día inválido.',
  must_be_before_endtime: 'La hora de inicio debe ser anterior a la de fin.',
  must_be_multiple_of_30: 'Cada rango debe durar un múltiplo de 30 minutos.',
  overlapping_ranges: 'Hay rangos superpuestos en el mismo día.',
};

const DAY_LABELS = {
  LUNES: 'Lunes',
  MARTES: 'Martes',
  MIÉRCOLES: 'Miércoles',
  JUEVES: 'Jueves',
  VIERNES: 'Viernes',
  SÁBADO: 'Sábado',
  DOMINGO: 'Domingo',
};

function toMinutes(time) {
  const [h, m] = time.split(':').map(Number);

  return h * 60 + m;
}

function validateRanges(ranges) {
  if (ranges.length === 0) return issueMessages.required;

  for (const [i, r] of ranges.entries()) {
    const start = toMinutes(r.startTime);
    const end = toMinutes(r.endTime);

    if (start >= end)
      return `Fila ${i + 1}: ${issueMessages.must_be_before_endtime}`;

    if ((end - start) % 30 !== 0)
      return `Fila ${i + 1}: ${issueMessages.must_be_multiple_of_30}`;

    const overlaps = ranges.some(
      (o, j) =>
        j !== i &&
        o.day === r.day &&
        start < toMinutes(o.endTime) &&
        toMinutes(o.startTime) < end
    );

    if (overlaps)
      return `Fila ${i + 1}: se superpone con otro rango del ${DAY_LABELS[r.day]}.`;
  }

  return null;
}

function DoctorAvailabilityPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const doctorName = state?.doctor?.name;

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
  } = useForm({ defaultValues: { ranges: [] } });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ranges',
  });

  const loadRules = useCallback(async () => {
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
      reset({
        ranges: data.map((r) => ({
          day: r.day,
          startTime: toHHmm(r.startTime),
          endTime: toHHmm(r.endTime),
        })),
      });
    }

    setLoading(false);
  }, [id, reset]);

  useEffect(() => {
    loadRules();
  }, [loadRules]);

  const submit = async ({ ranges }) => {
    setFormError('');
    setSuccess(null);

    const problem = validateRanges(ranges);

    if (problem) {
      setFormError(problem);

      return;
    }

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
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <nav className="text-xs text-med-text-muted mb-2">
          <Link to={LIST_PATH} className="hover:text-med-primary-700">
            Doctores
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-med-text-main font-medium">
            Disponibilidad horaria
          </span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Disponibilidad horaria
          {doctorName && (
            <span className="text-med-primary-700"> · {doctorName}</span>
          )}
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Los rangos se aplican a lo que queda del mes actual y generan turnos
          de 30 minutos (se saltean los feriados). Guardar reemplaza la
          disponibilidad anterior.
        </p>
      </div>

      <Card className="border-med-border">
        {loading && (
          <p className="py-6 text-center text-sm text-med-text-muted">
            Cargando disponibilidad...
          </p>
        )}

        {!loading && loadError && (
          <div className="py-6 text-center">
            <p className="text-sm text-med-danger-text">{loadError}</p>
            <Link
              to={LIST_PATH}
              className="mt-2 inline-block text-xs font-semibold text-med-primary-700 underline"
            >
              Volver a Doctores
            </Link>
          </div>
        )}

        {!loading && !loadError && (
          <form
            onSubmit={handleSubmit(submit)}
            noValidate
            className="flex flex-col gap-5"
          >
            {success && (
              <p className="rounded-lg bg-med-active-bg px-4 py-3 text-sm text-med-active-text">
                Disponibilidad guardada para {success.month}/{success.year}. Se
                generaron {success.slotsGenerated} turnos nuevos.
              </p>
            )}

            {formError && (
              <p className="rounded-lg bg-med-danger-bg px-4 py-3 text-sm text-med-danger-text">
                {formError}
              </p>
            )}

            {fields.length === 0 && (
              <p className="rounded-lg border border-dashed border-med-border px-4 py-6 text-center text-sm text-med-text-muted">
                Este médico todavía no tiene disponibilidad cargada este mes.
              </p>
            )}

            {fields.length > 0 && (
              <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_auto] gap-3 text-[11px] font-semibold uppercase tracking-wider text-med-text-sub">
                <span>Día</span>
                <span>Desde</span>
                <span>Hasta</span>
                <span className="w-8" />
              </div>
            )}

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-center"
              >
                <select
                  aria-label={`Día de la fila ${index + 1}`}
                  className="col-span-2 sm:col-span-1 border border-med-border rounded-lg px-3 py-2 text-sm bg-white text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600"
                  {...register(`ranges.${index}.day`)}
                >
                  {DAYS.map((day) => (
                    <option key={day} value={day}>
                      {DAY_LABELS[day]}
                    </option>
                  ))}
                </select>
                <input
                  type="time"
                  step={1800}
                  aria-label={`Hora de inicio de la fila ${index + 1}`}
                  className="border border-med-border rounded-lg px-3 py-2 text-sm bg-white text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600"
                  {...register(`ranges.${index}.startTime`, { required: true })}
                />
                <input
                  type="time"
                  step={1800}
                  aria-label={`Hora de fin de la fila ${index + 1}`}
                  className="border border-med-border rounded-lg px-3 py-2 text-sm bg-white text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600"
                  {...register(`ranges.${index}.endTime`, { required: true })}
                />
                <button
                  type="button"
                  title="Quitar rango"
                  aria-label={`Quitar fila ${index + 1}`}
                  onClick={() => remove(index)}
                  className="col-span-2 sm:col-span-1 justify-self-end p-1.5 rounded-lg hover:bg-red-50 text-med-danger-text transition"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}

            <div className="flex flex-wrap justify-between gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => append({ ...EMPTY_RANGE })}
                disabled={isSubmitting}
              >
                + Agregar rango
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar disponibilidad'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

export default DoctorAvailabilityPage;
