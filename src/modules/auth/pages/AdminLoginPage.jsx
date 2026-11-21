import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import ErrorAlert from '../../shared/components/ErrorAlert';
import Input from '../../shared/components/Input';
import AuthBrandHeader from '../components/AuthBrandHeader';
import useAuth from '../hook/useAuth';

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

function AdminLoginPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', password: '' } });

  const navigate = useNavigate();
  const { singinAdmin } = useAuth();

  const onValid = async (formData) => {
    setErrorMessage('');

    const { error } = await singinAdmin(formData.email, formData.password);

    if (error) {
      setErrorMessage(error.message);

      return;
    }

    navigate('/admin/home', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-med-primary-950 px-4 py-8">
      {/* Brand Header */}
      <AuthBrandHeader />
      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/10">
        <div className="p-8 sm:p-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-med-primary-900">
              Bienvenido de nuevo
            </h2>
            <p className="text-xs text-med-text-sub mt-1 leading-relaxed">
              Por favor, autentíquese para acceder al portal de proveedores.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onValid)}
            className="flex flex-col gap-4"
            noValidate
          >
            {/* Correo Electrónico */}
            <Input
              label="Correo electrónico"
              type="email"
              autoComplete="email"
              placeholder="admin@medportal.com"
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

            {/* Contraseña */}
            <div className="flex flex-col gap-1.5">
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                icon={LockIcon}
                error={errors.password?.message}
                {...register('password', {
                  required: 'La contraseña es obligatoria',
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="self-end text-xs font-medium text-med-primary-700 hover:text-med-primary-900"
              >
                {showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              </button>
            </div>

            {/* Botón de Submit */}
            <Button
              type="submit"
              className="w-full mt-1 disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
            </Button>

            {/* Error Message */}
            <ErrorAlert className="text-center">{errorMessage}</ErrorAlert>
          </form>
        </div>

        {/* Banner Inferior Informativo */}
        <div className="bg-med-primary-50 border-t border-med-primary-100 p-4 sm:p-5 flex items-start gap-3">
          <svg
            className="w-5 h-5 text-med-primary-600 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <p className="text-xs text-med-text-sub leading-relaxed">
            <strong className="text-med-text-main font-semibold">
              Solo Acceso Seguro:
            </strong>{' '}
            Este sistema es para personal médico autorizado. Los intentos de
            acceso no autorizados son registrados y monitoreados para su
            cumplimiento.
          </p>
        </div>
      </div>

      {/* Switch to Patient Portal */}
      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-xs text-med-primary-200 hover:text-white transition"
        >
          ← Volver al Portal de Pacientes
        </Link>
      </div>
    </div>
  );
}

export default AdminLoginPage;
