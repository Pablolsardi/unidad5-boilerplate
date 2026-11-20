import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$/;

const PASSWORD_RULES =
  'Mínimo 6 caracteres, con al menos una mayúscula, una minúscula, un número y un carácter especial (ej: !, @, #).';

function AdminRegisterForm({ onSubmit, onCancel }) {
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const submit = async (values) => {
    setServerError('');

    const error = await onSubmit({
      email: values.email.trim(),
      password: values.password,
    });

    if (!error) {
      reset();

      return;
    }

    const fields = error.details.map((d) => d.field ?? '');

    if (fields.some((f) => f.startsWith('Duplicate'))) {
      setError('email', { message: 'Ya existe un usuario con ese email.' });

      return;
    }

    if (fields.some((f) => f.startsWith('Password'))) {
      setError('password', { message: PASSWORD_RULES });

      return;
    }

    if (error.code === 'REGISTER_USER_INVALID') {
      setError('email', { message: 'El email no es válido.' });

      return;
    }

    setServerError(error.message);
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
        id="admin-email"
        type="email"
        label="Email"
        placeholder="Ej: admin@medportal.com"
        autoComplete="off"
        error={errors.email?.message}
        {...register('email', {
          required: 'El email es obligatorio.',
          pattern: { value: EMAIL_REGEX, message: 'El email no es válido.' },
        })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          id="admin-password"
          type="password"
          label="Contraseña"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password', {
            required: 'La contraseña es obligatoria.',
            pattern: { value: PASSWORD_REGEX, message: PASSWORD_RULES },
          })}
        />

        <Input
          id="admin-confirm-password"
          type="password"
          label="Repetir Contraseña"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Repetí la contraseña.',
            validate: (v) =>
              v === getValues('password') || 'Las contraseñas no coinciden.',
          })}
        />
      </div>

      <p className="text-xs text-med-text-muted">{PASSWORD_RULES}</p>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registrando...' : 'Registrar Administrador'}
        </Button>
      </div>
    </form>
  );
}

export default AdminRegisterForm;