import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import StatusBadge from '../../shared/components/StatusBadge';
import { formatLongDate, isPastSlot } from '../helpers/dateHelpers';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import useAuth from '../../auth/hook/useAuth';
import {
  cancelAppointment,
  getMyAppointments,
} from '../services/appointmentsService';

function AppointmentsPage() {
  const navigate = useNavigate();
  const { dni } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Cancelacion
  const [toCancel, setToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Al entrar a la página: traer los turnos del paciente logueado
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      const { data, error } = await getMyAppointments(dni);

      if (ignore) return;

      setLoading(false);

      if (error) {
        setLoadError(error.message);

        return;
      }

      // Ordenados del más próximo al más lejano
      const sorted = [...data].sort((a, b) =>
        `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)
      );

      setAppointments(sorted);
    };

    load();

    return () => {
      ignore = true;
    };
  }, [dni]);

  const openCancelDialog = (appt) => {
    setToCancel(appt);
    setCancelError('');
    setSuccessMsg('');
  };

  const closeCancelDialog = () => {
    setToCancel(null);
    setCancelError('');
  };

  const handleConfirmCancel = async () => {
    setCancelling(true);
    const { error } = await cancelAppointment(toCancel.id);

    setCancelling(false);

    if (error) {
      setCancelError(error.message);

      return;
    }

    // El back solo devuelve turnos reservados, sacamos el cancelado de la lista
    setAppointments((prev) => prev.filter((a) => a.id !== toCancel.id));
    setSuccessMsg('El turno fue cancelado.');
    setToCancel(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Mis Turnos Médicos
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Consulta y gestiona las citas médicas programadas.
          </p>
        </div>
        <Button onClick={() => navigate('/')}>+ Solicitar Nuevo Turno</Button>
      </div>

      {successMsg && (
        <p className="rounded-lg bg-med-active-bg px-3 py-2 text-xs text-med-active-text">
          {successMsg}
        </p>
      )}

      {loading && (
        <p className="py-10 text-center text-sm text-med-text-sub">
          Cargando tus turnos...
        </p>
      )}

      {loadError && (
        <p className="rounded-lg bg-med-danger-bg px-3 py-2 text-xs text-med-danger-text">
          {loadError}
        </p>
      )}

      {!loading && !loadError && appointments.length === 0 && (
        <Card className="p-8 text-center border-dashed">
          <p className="text-sm text-med-text-sub">
            No tenés turnos reservados.
          </p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            Reservar mi primer turno
          </Button>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {appointments.map((appt) => {
          const isPast = isPastSlot(appt);

          return (
            <Card
              key={appt.id}
              className={`flex flex-col justify-between gap-4 p-6 ${
                isPast ? 'opacity-60' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700">
                    {appt.speciality ?? 'Sin especialidad'}
                  </span>
                  <StatusBadge status={appt.status} />
                </div>
                <h3 className="text-lg font-bold text-med-primary-900">
                  {appt.doctor}
                </h3>
                <p className="text-sm text-med-text-sub mt-2 first-letter:uppercase">
                  <strong className="text-med-text-main font-semibold">
                    {formatLongDate(appt.date)}
                  </strong>{' '}
                  a las{' '}
                  <strong className="text-med-text-main font-semibold">
                    {appt.startTime.slice(0, 5)} hs
                  </strong>
                </p>
                <p className="text-xs text-med-text-muted mt-1">
                  Motivo: {appt.reason}
                </p>
              </div>
              <div className="flex gap-2 pt-3 border-t border-med-border">
                {isPast ? (
                  <p className="w-full text-center text-xs text-med-text-muted">
                    Este turno ya pasó.
                  </p>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full text-xs"
                    onClick={() => openCancelDialog(appt)}
                  >
                    Cancelar Turno
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
      <ConfirmDialog
        open={toCancel !== null}
        title="¿Cancelar este turno?"
        message={
          toCancel &&
          `Turno con ${toCancel.doctor} el ${formatLongDate(toCancel.date)} a las ${toCancel.startTime.slice(0, 5)} hs. Esta acción no se puede deshacer.`
        }
        confirmText="Sí, cancelar turno"
        cancelText="Volver"
        loading={cancelling}
        error={cancelError}
        onConfirm={handleConfirmCancel}
        onCancel={closeCancelDialog}
      />
    </div>
  );
}

export default AppointmentsPage;
