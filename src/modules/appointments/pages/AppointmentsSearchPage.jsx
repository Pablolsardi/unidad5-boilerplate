import { useState, useEffect } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { searchAppointments } from '../services/appointmentsService';
import StatusBadge from '../../shared/components/StatusBadge';
import { getSpecialties } from '../../specialties/services/specialtiesService';
import { getDoctors } from '../../doctors/services/doctorsService';
import TablePagination from '../../shared/components/TablePagination';

const PAGE_SIZE = 10;

function AppointmentsSearchPage() {
  const [patientQuery, setPatientQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');

      const { data, error } = await searchAppointments({
        ...appliedFilters,
        pageIndex: page,
        pageSize: PAGE_SIZE,
      });

      if (error) {
        setError(error.message);
      } else {
        setAppointments(data.data);
        setTotal(data.total);
      }

      setLoading(false);
    };

    load();
  }, [appliedFilters, page]);

  useEffect(() => {
    const loadOptions = async () => {
      const [specialtiesRes, doctorsRes] = await Promise.all([
        getSpecialties({ pageSize: 100 }),
        getDoctors({ pageSize: 100 }),
      ]);

      setSpecialties(specialtiesRes.data?.data ?? []);
      setDoctors(doctorsRes.data?.data ?? []);
    };

    loadOptions();
  }, []);

  const filteredDoctors = specialtyFilter
    ? doctors.filter((d) => d.specialty?.id === specialtyFilter)
    : doctors;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      {/* Título de la página */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Búsqueda y Filtrado de Citas
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Gestione y supervise el flujo de pacientes del departamento.
        </p>
      </div>

      {/* Card Superior: Criterios de Búsqueda */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-med-border-subtle">
          <h2 className="text-base font-bold text-med-primary-900">
            Criterios de Búsqueda
          </h2>
        </div>

        {/* Inputs de Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-4 items-end">
          {/* Nombre o DNI */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              DNI del Paciente
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-med-text-muted">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={patientQuery}
                onChange={(e) => setPatientQuery(e.target.value)}
                placeholder="40123456"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
              />
            </div>
          </div>

          {/* Especialidad */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Especialidad
            </label>
            <select
              value={specialtyFilter}
              onChange={(e) => {
                setSpecialtyFilter(e.target.value);
                setDoctorFilter('');
              }}
              className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            >
              <option value="">Todas las especialidades</option>
              {specialties.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Doctor
            </label>
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            >
              <option value="">Todos los médicos</option>
              {filteredDoctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Fecha
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>

          {/* Botón Aplicar Filtros */}
          <div>
            <Button
              onClick={() => {
                setPage(1);
                setAppliedFilters({
                  dni: patientQuery.replaceAll('.', ''),
                  specialtyId: specialtyFilter,
                  doctorId: doctorFilter,
                  date: dateFilter,
                });
              }}
              className="w-full flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium py-2 rounded-lg"
            >
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>Aplicar Filtros</span>
            </Button>
          </div>
        </div>

        {/* Chips de Filtros Activos */}
        {Object.values(appliedFilters).some(Boolean) && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-med-border-subtle">
            {appliedFilters.dni && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-100/70 text-sky-800">
                DNI: {appliedFilters.dni}
              </span>
            )}
            {appliedFilters.specialtyId && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-100/70 text-sky-800">
                Especialidad:{' '}
                {
                  specialties.find((s) => s.id === appliedFilters.specialtyId)
                    ?.name
                }
              </span>
            )}
            {appliedFilters.doctorId && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-100/70 text-sky-800">
                Médico:{' '}
                {doctors.find((d) => d.id === appliedFilters.doctorId)?.name}
              </span>
            )}
            {appliedFilters.date && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-100/70 text-sky-800">
                Fecha: {appliedFilters.date.split('-').reverse().join('/')}
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setPatientQuery('');
                setSpecialtyFilter('');
                setDoctorFilter('');
                setDateFilter('');
                setPage(1);
                setAppliedFilters({});
              }}
              className="text-xs font-semibold text-med-primary-700 hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </Card>

      {/* Card Inferior: Registros de Citas */}
      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Citas
          </h2>
        </div>

        {/* Tabla de Citas */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-6 py-3.5">Fecha y hora</th>
                <th className="px-6 py-3.5">Departamento</th>
                <th className="px-6 py-3.5">Paciente</th>
                <th className="px-6 py-3.5 text-center">Estado</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border-subtle">
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-med-text-muted"
                  >
                    Cargando turnos...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-med-danger-text"
                  >
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && appointments.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-med-text-muted"
                  >
                    No se encontraron turnos.
                  </td>
                </tr>
              )}
              {!loading &&
                appointments.map((item) => (
                  <tr
                    key={item.appointmentsId}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    {/* Fecha y Hora */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-med-primary-900 text-sm">
                        {item.date.split('-').reverse().join('/')}
                      </p>
                      <p className="text-xs text-med-text-muted mt-0.5">
                        {item.startTime.slice(0, 5)} -{' '}
                        {item.endTime.slice(0, 5)}
                      </p>
                    </td>

                    {/* Departamento / Especialidad con Icono */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold text-med-primary-900">
                            {item.doctor.specialty?.name ?? 'Sin especialidad'}
                          </p>
                          <p className="text-xs text-med-text-muted">
                            {item.doctor.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Paciente y DNI */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-med-text-main">
                        {item.patient.fullName ?? 'Paciente'}
                      </p>
                      <p className="text-xs text-med-text-muted mt-0.5">
                        DNI: {item.patient.dni}
                      </p>
                    </td>

                    {/* Estado (CONFIRMADO, COMPLETADO, CANCELADO) */}
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={item.appointmentsStatus} />
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          alert(`Ver detalle de cita de ${item.patient.dni}`)
                        }
                        className="text-xs font-semibold text-med-primary-700 hover:text-med-primary-900 transition hover:underline"
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Paginador inferior normalizado */}
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
}

export default AppointmentsSearchPage;
