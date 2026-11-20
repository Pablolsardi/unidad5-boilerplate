import { Link, useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import SpecialtyForm from '../components/SpecialtyForm';
import { createSpecialty } from '../services/specialtiesService';

const LIST_PATH = '/admin/specialties';

function SpecialtyFormPage() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { error } = await createSpecialty(values);

    if (error) return error;

    navigate(LIST_PATH);

    return null;
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <nav className="text-xs text-med-text-muted mb-2">
          <Link to={LIST_PATH} className="hover:text-med-primary-700">
            Especialidades
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-med-text-main font-medium">
            Agregar Nueva Especialidad
          </span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Registrar Nueva Especialidad
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Complete la información para dar de alta una especialidad médica.
        </p>
      </div>

      <Card className="border-med-border">
        <SpecialtyForm
          submitText="Guardar Especialidad"
          onSubmit={handleSubmit}
          onCancel={() => navigate(LIST_PATH)}
        />
      </Card>
    </div>
  );
}

export default SpecialtyFormPage;
