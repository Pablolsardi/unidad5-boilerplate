import Select from '../../shared/components/Select';

// Dos selects encadenados: primero especialidad, después médico.
// Solo presenta: el estado y las cargas viven en PatientHome / hooks.
function SpecialtyDoctorPicker({
  specialties,
  specialtyId,
  onSpecialtyChange,
  doctors,
  doctorId,
  onDoctorChange,
  loadingDoctors = false,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Select
        label="Especialidad"
        value={specialtyId}
        onChange={(e) => onSpecialtyChange(e.target.value)}
      >
        <option value="">Elegí una especialidad</option>
        {specialties.map((specialty) => (
          <option key={specialty.id} value={specialty.id}>
            {specialty.name}
          </option>
        ))}
      </Select>

      <Select
        label="Médico"
        value={doctorId}
        onChange={(e) => onDoctorChange(e.target.value)}
        disabled={!specialtyId || loadingDoctors}
      >
        <option value="">
          {loadingDoctors ? 'Cargando médicos...' : 'Elegí un médico'}
        </option>
        {doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            {doctor.name}
          </option>
        ))}
      </Select>
    </div>
  );
}

export default SpecialtyDoctorPicker;
