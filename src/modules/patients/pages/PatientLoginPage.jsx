import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../../shared/helpers/errorMessages';
import Button from '../../shared/components/Button';
import useAuth from '../../auth/hook/useAuth';
import ErrorAlert from '../../shared/components/ErrorAlert';
import AuthBrandHeader from '../../auth/components/AuthBrandHeader';
import Input from '../../shared/components/Input';

const MailIcon = (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const LockIcon = (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

function PatientLoginPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', dni: '' } });

  const navigate = useNavigate();
  const { singinPatient } = useAuth();

  const onValid = async (formData) => {
    setErrorMessage('');

    const { error } = await singinPatient(formData.email, formData.dni);

    if (error) {
      setErrorMessage(
        error.code === 'AUTHENTICATION_FAILED'
          ? getErrorMessage('PATIENT_LOGIN_INVALID')
          : error.message
      );

      return;
    }

    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-med-primary-950 px-4 py-8 sm:p-6">
      <AuthBrandHeader />

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-white/10 p-6 sm:p-10">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-med-primary-900">
            Portal del Paciente
          </h2>
          <p className="text-xs text-med-text-sub mt-1 leading-relaxed">
            Inicia sesión para reservar y consultar tus turnos médicos
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onValid)}
          className="flex flex-col gap-4"
          noValidate
        >
          <Input
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            placeholder="paciente@medportal.com"
            icon={MailIcon}
            error={errors.email?.message}
            {...register('email', {
              required: 'El correo electrónico es obligatorio',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Ingresá un correo electrónico válido',
              },
            })}
          />

          <Input
            label="DNI"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="40123456"
            icon={LockIcon}
            error={errors.dni?.message}
            {...register('dni', {
              required: 'El DNI es obligatorio',
              pattern: {
                value: /^\d{7,8}$/,
                message: 'El DNI debe tener 7 u 8 dígitos, sin puntos',
              },
            })}
          />

          <Button
            type="submit"
            className="w-full mt-1 disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </Button>

          <ErrorAlert className="text-center">{errorMessage}</ErrorAlert>
        </form>
      </div>

      {/* Switch to Admin Portal */}
      <div className="mt-6 text-center">
        <Link
          to="/admin/login"
          className="text-xs text-med-primary-200 hover:text-white transition"
        >
          ¿Es personal administrativo o médico? Ingrese aquí →
        </Link>
      </div>
    </div>
  );
}

export default PatientLoginPage;
