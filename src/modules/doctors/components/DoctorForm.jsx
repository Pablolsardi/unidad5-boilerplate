import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import { getSpecialties } from '../../specialties/services/specialtiesService';

function DoctorForm({
  defaultValues,
  submitText = 'Guardar',
  onSubmit,
  onCancel,
}) {
  const [serverError, setServerError] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);
  const [specialtiesError, setSpecialtiesError] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      licenseNumber: '',
      specialtyId: '',
      ...defaultValues,
    },
  });

  useEffect(() => {
    const load = async () => {
      const { data, error } = await getSpecialties({
        pageIndex: 1,
        pageSize: 100,
      });

      if (error) setSpecialtiesError(error.message);
      else setSpecialties(data.data);

      setLoadingSpecialties(false);
    };

    load();
  }, []);

  const submit = async (values) => {
    setServerError('');

    const error = await onSubmit({
      name: values.name.trim(),
      licenseNumber: values.licenseNumber.trim(),
      specialtyId: values.specialtyId,
    });

    if (!error) return;

    if (error.code === 'DOCTOR_NAME_INVALID') {
      setError('name', {
        message: 'El nombre debe tener entre 3 y 100 caracteres.',
      });

      return;
    }

    if (error.code === 'ENTITY_NOTFOUND') {
      setError('specialtyId', {
        message: 'La especialidad elegida ya no existe.',
      });

      return;
    }

    setServerError(error.message);
  };

  const noSpecialties =
    !loadingSpecialties && !specialtiesError && specialties.length === 0;

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="flex flex-col gap-5"
    >
      {serverError && (
        <p className="rounded-lg bg-med-danger-bg px-4 py-3 text-sm text-med-danger-text">
          {serverError}
        </p>
      )}

      <Input
        id="doctor-name"
        label="Nombre completo"
        placeholder="Ej: Dra. Elena Martínez"
        error={errors.name?.message}
        {...register('name', {
          required: 'El nombre es obligatorio.',
          validate: (v) => {
            const length = v.trim().length;

            return (
              (length >= 3 && length <= 100) ||
              'El nombre debe tener entre 3 y 100 caracteres.'
            );
          },
        })}
      />

      <Input
        id="doctor-license"
        label="Matrícula"
        placeholder="Ej: MP-12345"
        error={errors.licenseNumber?.message}
        {...register('licenseNumber', {
          required: 'La matrícula es obligatoria.',
          validate: (v) =>
            v.trim().length <= 50 ||
            'La matrícula no puede superar los 50 caracteres.',
        })}
      />

      <div className="flex flex-col gap-1.5 w-full">
        <label
          htmlFor="doctor-specialty"
          className="text-xs font-semibold text-med-text-main"
        >
          Especialidad
        </label>
        <select
          id="doctor-specialty"
          disabled={loadingSpecialties || noSpecialties}
          className={`w-full border rounded-lg px-3.5 py-2.5 text-sm bg-white text-med-text-main transition focus:outline-none focus:ring-2 focus:ring-med-primary-600 focus:border-transparent disabled:bg-gray-50 ${
            errors.specialtyId
              ? 'border-red-400 bg-red-50/20'
              : 'border-med-border'
          }`}
          {...register('specialtyId', {
            required: 'Elegí una especialidad.',
          })}
        >
          <option value="">
            {loadingSpecialties
              ? 'Cargando especialidades...'
              : 'Seleccione una especialidad'}
          </option>
          {specialties.map((spec) => (
            <option key={spec.id} value={spec.id}>
              {spec.name}
            </option>
          ))}
        </select>
        {errors.specialtyId && (
          <p className="text-xs text-red-500 font-medium">
            {errors.specialtyId.message}
          </p>
        )}
        {specialtiesError && (
          <p className="text-xs text-red-500 font-medium">{specialtiesError}</p>
        )}
        {noSpecialties && (
          <p className="text-xs text-med-text-muted">
            No hay especialidades cargadas. Creá una antes de registrar un
            médico.
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || noSpecialties}>
          {isSubmitting ? 'Guardando...' : submitText}
        </Button>
      </div>
    </form>
  );
}

export default DoctorForm;
