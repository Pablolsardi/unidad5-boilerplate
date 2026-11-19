import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';

const backendFieldMessages = {
  name: 'El nombre debe tener entre 3 y 100 caracteres.',
  description: 'La descripción debe tener entre 10 y 100 caracteres.',
};

function SpecialtyForm({
  defaultValues,
  submitText = 'Guardar',
  onSubmit,
  onCancel,
}) {
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: '', description: '', ...defaultValues },
  });

  const submit = async (values) => {
    setServerError('');

    const error = await onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
    });

    if (!error) return;

    if (error.code === 'SPECIALITY_DUPLICATED') {
      setError('name', { message: error.message });

      return;
    }

    const fieldErrors = error.details.filter(
      (d) => backendFieldMessages[d.field?.toLowerCase()]
    );

    fieldErrors.forEach((d) => {
      const field = d.field.toLowerCase();

      setError(field, { message: backendFieldMessages[field] });
    });

    if (fieldErrors.length === 0) setServerError(error.message);
  };

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
        id="specialty-name"
        label="Nombre de la Especialidad"
        placeholder="Ej: Cardiología Intervencionista"
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

      <div className="flex flex-col gap-1.5 w-full">
        <label
          htmlFor="specialty-description"
          className="text-xs font-semibold text-med-text-main"
        >
          Descripción
        </label>
        <textarea
          id="specialty-description"
          rows={4}
          placeholder="Describa el alcance de la especialidad..."
          className={`w-full border rounded-lg px-3.5 py-2.5 text-sm bg-white text-med-text-main placeholder-med-text-muted transition focus:outline-none focus:ring-2 focus:ring-med-primary-600 focus:border-transparent resize-none ${
            errors.description
              ? 'border-red-400 bg-red-50/20'
              : 'border-med-border'
          }`}
          {...register('description', {
            required: 'La descripción es obligatoria.',
            validate: (v) => {
              const length = v.trim().length;

              return (
                (length >= 10 && length <= 100) ||
                'La descripción debe tener entre 10 y 100 caracteres.'
              );
            },
          })}
        />
        {errors.description && (
          <p className="text-xs text-red-500 font-medium">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : submitText}
        </Button>
      </div>
    </form>
  );
}

export default SpecialtyForm;
