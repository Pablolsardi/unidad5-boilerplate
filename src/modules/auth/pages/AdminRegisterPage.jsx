import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import AdminRegisterForm from '../components/AdminRegisterForm';
import { registerAdmin } from '../services/adminRegister';

function AdminRegisterPage() {
  const navigate = useNavigate();
  const [successEmail, setSuccessEmail] = useState('');

  // devuelve el error o null para que el formulario lo muestre
  const handleSubmit = async (values) => {
    setSuccessEmail('');

    const { error } = await registerAdmin(values);

    if (error) return error;

    setSuccessEmail(values.email);

    return null;
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Registrar Administrador
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Dé de alta un nuevo usuario con acceso al panel administrativo.
        </p>
      </div>

      {successEmail && (
        <p className="rounded-lg bg-med-primary-50 px-4 py-3 text-sm text-med-primary-700">
          Se registró el administrador <strong>{successEmail}</strong>. Ya puede
          ingresar con su email y contraseña.
        </p>
      )}

      <Card className="border-med-border">
        <AdminRegisterForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/home')}
        />
      </Card>
    </div>
  );
}

export default AdminRegisterPage;
