import { Link, useNavigate, useParams } from 'react-router-dom';
import Card from '../../shared/components/Card';
import SpecialtyForm from '../components/SpecialtyForm';
import useSpecialty from '../hooks/useSpecialty';
import {
  createSpecialty,
  updateSpecialty,
} from '../services/specialtiesService';

const LIST_PATH = '/admin/specialties';

function SpecialtyFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { specialty, loading, error } = useSpecialty(id);

  const handleSubmit = async (values) => {
    const { error } = isEdit
      ? await updateSpecialty(id, values)
      : await createSpecialty(values);

    if (error) return error;

    navigate(LIST_PATH);

    return null;
  };

  if (loading) {
    return (
      <p className="text-sm text-med-text-muted">Cargando especialidad...</p>
    );
  }

  if (error) {
    return <p className="text-sm text-med-danger-text">{error}</p>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <nav className="text-xs text-med-text-muted mb-2">
          <Link to={LIST_PATH} className="hover:text-med-primary-700">
            Especialidades
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-med-text-main font-medium">
            {isEdit ? 'Editar Especialidad' : 'Agregar Nueva Especialidad'}
          </span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          {isEdit ? 'Editar Especialidad' : 'Registrar Nueva Especialidad'}
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          {isEdit
            ? 'Modifique los datos de la especialidad.'
            : 'Complete la información para dar de alta una especialidad médica.'}
        </p>
      </div>

      <Card className="border-med-border">
        <SpecialtyForm
          defaultValues={specialty ?? undefined}
          submitText={isEdit ? 'Guardar Cambios' : 'Guardar Especialidad'}
          onSubmit={handleSubmit}
          onCancel={() => navigate(LIST_PATH)}
        />
      </Card>
    </div>
  );
}

export default SpecialtyFormPage;
