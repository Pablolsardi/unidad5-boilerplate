import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';

// Auth Module
import AdminLoginPage from './modules/auth/pages/AdminLoginPage';

// Patients Module
import PatientLoginPage from './modules/patients/pages/PatientLoginPage';
import PatientLayout from './modules/patients/components/PatientLayout';
import PatientHome from './modules/patients/pages/PatientHome';
import AppointmentsPage from './modules/patients/pages/AppointmentsPage';

// Dashboard Module
import DashboardLayout from './modules/dashboard/components/DashboardLayout';
import OverviewPage from './modules/dashboard/pages/OverviewPage';

// Domain Modules (Screaming Architecture)
import DoctorsPage from './modules/doctors/pages/DoctorsPage';
import DoctorFormPage from './modules/doctors/pages/DoctorFormPage';
import DoctorAvailabilityPage from './modules/doctors/pages/DoctorAvailabilityPage';
import SpecialtiesPage from './modules/specialties/pages/SpecialtiesPage';
import SpecialtyFormPage from './modules/specialties/pages/SpecialtyFormPage';
import AppointmentsSearchPage from './modules/appointments/pages/AppointmentsSearchPage';

const routes = [
  // Rutas públicas
  {
    path: '/login',
    element: <PatientLoginPage />,
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },

  // Rutas privadas de pacientes (URL base y turnos)
  {
    path: '/',
    element: (
      <ProtectedRoute redirectTo="/login" allowedRoles={['PACIENTE']}>
        <PatientLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <PatientHome />,
      },
      {
        path: 'appointments',
        element: <AppointmentsPage />,
      },
    ],
  },

  // Rutas privadas de gestión clínica y administración
  {
    path: '/admin',
    element: (
      <ProtectedRoute
        redirectTo="/admin/login"
        allowedRoles={['ADMINISTRADOR']}
      >
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/home" replace />,
      },
      {
        path: 'home',
        element: <OverviewPage />,
      },
      {
        path: 'appointments',
        element: <AppointmentsSearchPage />,
      },
      {
        path: 'patient-search',
        element: <Navigate to="/admin/appointments" replace />,
      },
      {
        path: 'patients',
        element: <Navigate to="/admin/appointments" replace />,
      },
      {
        path: 'specialties',
        element: <SpecialtiesPage />,
      },
      {
        path: 'specialties/new',
        element: <SpecialtyFormPage />,
      },
      {
        path: 'specialties/:id/edit',
        element: <SpecialtyFormPage />,
      },
      {
        path: 'doctors',
        element: <DoctorsPage />,
      },
      {
        path: 'doctors/new',
        element: <DoctorFormPage />,
      },
      {
        path: 'doctors/:id/edit',
        element: <DoctorFormPage />,
      },
      {
        path: 'doctors/availability',
        element: <DoctorAvailabilityPage />,
      },
      {
        path: 'doctors/:id/availability',
        element: <DoctorAvailabilityPage />,
      },
    ],
  },

  // Redirección para cualquier otra URL
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
