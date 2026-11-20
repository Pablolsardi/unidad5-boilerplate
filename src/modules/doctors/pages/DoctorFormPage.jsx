import { Link, useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import DoctorForm from '../components/DoctorForm';
import { createDoctor } from '../services/doctorsService';

const LIST_PATH = '/admin/doctors';

function DoctorFormPage() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { error } = await createDoctor(values);

    if (error) return error;

    navigate(LIST_PATH);

    return null;
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <nav className="text-xs text-med-text-muted mb-2">
          <Link to={LIST_PATH} className="hover:text-med-primary-700">
            Doctores
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-med-text-main font-medium">
            Registrar Nuevo Médico
          </span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Registrar Nuevo Médico
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Complete los datos profesionales para dar de alta un médico.
        </p>
      </div>

      <Card className="border-med-border">
        <DoctorForm
          submitText="Guardar Médico"
          onSubmit={handleSubmit}
          onCancel={() => navigate(LIST_PATH)}
        />
      </Card>
    </div>
  );
}

export default DoctorFormPage;
