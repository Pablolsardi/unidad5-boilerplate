import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import ErrorAlert from '../../shared/components/ErrorAlert';
import useAuth from '../../auth/hook/useAuth';
import useSpecialties from '../../specialties/hooks/useSpecialties';
import useDoctorsBySpecialty from '../hooks/useDoctorsBySpecialty';
import useDoctorSlots from '../hooks/useDoctorSlots';
import useWeekCalendar from '../hooks/useWeekCalendar';
import useBookAppointment from '../hooks/useBookAppointment';
import SpecialtyDoctorPicker from '../components/SpecialtyDoctorPicker';
import DoctorSummaryCard from '../components/DoctorSummaryCard';
import WeekSlotsCalendar from '../components/WeekSlotsCalendar';
import BookingForm from '../components/BookingForm';
import BookingConfirmedModal from '../components/BookingConfirmedModal';

const MAX_SPECIALTIES = 100;

// Contenedor del flujo de reserva: especialidad → médico → horario → motivo.
// Guarda solo las 3 elecciones del usuario; los datos los traen los hooks
// y el render lo hacen los componentes de presentación.
function PatientHome() {
  const navigate = useNavigate();
  const { dni } = useAuth();

  const [specialtyId, setSpecialtyId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  const { specialties, error: specialtiesError } = useSpecialties({
    pageSize: MAX_SPECIALTIES,
  });
  const {
    doctors,
    loading: loadingDoctors,
    error: doctorsError,
  } = useDoctorsBySpecialty(specialtyId);
  const {
    slots,
    loading: loadingSlots,
    error: slotsError,
    reload: reloadSlots,
  } = useDoctorSlots(doctorId);
  const calendar = useWeekCalendar(slots);
  const booking = useBookAppointment();

  const currentDoctor = doctors.find((doctor) => doctor.id === doctorId);
  const loadError = specialtiesError || doctorsError || slotsError;

  const handleSpecialtyChange = (id) => {
    setSpecialtyId(id);
    setDoctorId('');
    setSelectedSlot(null);
    booking.clearError();
  };

  const handleDoctorChange = (id) => {
    setDoctorId(id);
    setSelectedSlot(null);
    booking.clearError();
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    calendar.setSelectedDate(slot.date);
    booking.clearError();
  };

  const handleBook = async (reason) => {
    const { ok, slotUnavailable } = await booking.book({
      doctorId,
      slotId: selectedSlot.id,
      reason,
    });

    // Si reservó, o si el horario ya no está disponible, lo soltamos y
    // recargamos: en los dos casos ese horario desaparece del calendario.
    if (ok || slotUnavailable) {
      setSelectedSlot(null);
      reloadSlots();
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <Card className="p-6 sm:p-7">
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-primary-900">
            Reservar Turno Médico
          </h1>
          <p className="text-xs sm:text-sm text-med-text-sub mt-1">
            Elegí la especialidad y el profesional para continuar.
          </p>
        </div>

        <SpecialtyDoctorPicker
          specialties={specialties}
          specialtyId={specialtyId}
          onSpecialtyChange={handleSpecialtyChange}
          doctors={doctors}
          doctorId={doctorId}
          onDoctorChange={handleDoctorChange}
          loadingDoctors={loadingDoctors}
        />

        <ErrorAlert className="mt-4">{loadError}</ErrorAlert>
      </Card>

      {!currentDoctor && (
        <Card className="p-8 text-center border-dashed">
          <p className="text-sm text-med-text-sub">
            Elegí una especialidad y un médico para ver los horarios
            disponibles.
          </p>
        </Card>
      )}

      {currentDoctor && (
        <>
          <DoctorSummaryCard
            name={currentDoctor.name}
            specialtyName={currentDoctor.specialty?.name}
            licenseNumber={currentDoctor.licenseNumber}
          />

          <Card className="p-5 sm:p-6">
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
              <WeekSlotsCalendar
                weekStart={calendar.weekStart}
                weekDates={calendar.weekDates}
                slotsByDate={calendar.slotsByDate}
                selectedDate={calendar.selectedDate}
                onSelectDate={calendar.setSelectedDate}
                selectedSlotId={selectedSlot?.id}
                onSelectSlot={handleSelectSlot}
                canGoBack={calendar.canGoBack}
                onChangeWeek={calendar.changeWeek}
              />
            )}
          </Card>
        </>
      )}

      {selectedSlot ? (
        <BookingForm
          slot={selectedSlot}
          doctorName={currentDoctor?.name}
          error={booking.error}
          onSubmit={handleBook}
        />
      ) : (
        // Error de reserva cuando ya se soltó el horario (ej: turno tomado)
        <ErrorAlert>{booking.error}</ErrorAlert>
      )}

      {booking.confirmed && (
        <BookingConfirmedModal
          appointment={booking.confirmed}
          dni={dni}
          onViewAppointments={() => navigate('/appointments')}
          onClose={booking.closeConfirmation}
        />
      )}
    </div>
  );
}

export default PatientHome;
