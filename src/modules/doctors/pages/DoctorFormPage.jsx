import { Link, useNavigate, useParams } from 'react-router-dom';
import Card from '../../shared/components/Card';
import DoctorForm from '../components/DoctorForm';
import useDoctor from '../hooks/useDoctor';
import { createDoctor, updateDoctor } from '../services/doctorsService';

const LIST_PATH = '/admin/doctors';

// El back devuelve { specialty: { id, name } } y el form espera specialtyId
const toFormValues = (doctor) => ({
  name: doctor.name,
  licenseNumber: doctor.licenseNumber ?? '',
  specialtyId: doctor.specialty?.id ?? '',
});

function DoctorFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { doctor, loading, error } = useDoctor(id);

  // Devuelve el error (o null) para que el formulario lo muestre
  const handleSubmit = async (values) => {
    const { error } = isEdit
      ? await updateDoctor(id, values)
      : await createDoctor(values);

    if (error) return error;

    navigate(LIST_PATH);

    return null;
  };

  if (loading) {
    return <p className="text-sm text-med-text-muted">Cargando médico...</p>;
  }

  if (error) {
    return <p className="text-sm text-med-danger-text">{error}</p>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <nav className="text-xs text-med-text-muted mb-2">
          <Link to={LIST_PATH} className="hover:text-med-primary-700">
            Doctores
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-med-text-main font-medium">
            {isEdit ? 'Editar Doctor' : 'Agregar Nuevo Doctor'}
          </span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          {isEdit ? 'Editar Doctor' : 'Registrar Nuevo Doctor'}
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          {isEdit
            ? 'Modifique los datos del doctor.'
            : 'Complete todos los campos obligatorios para integrar al nuevo facultativo al sistema del centro médico.'}
        </p>
      </div>

      <Card className="border-med-border">
        <DoctorForm
          defaultValues={doctor ? toFormValues(doctor) : undefined}
          submitText={isEdit ? 'Guardar Cambios' : 'Guardar Doctor'}
          onSubmit={handleSubmit}
          onCancel={() => navigate(LIST_PATH)}
        />
      </Card>
    </div>
  );
}

export default DoctorFormPage;
