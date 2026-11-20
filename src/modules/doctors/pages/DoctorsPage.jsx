import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import TablePagination from '../../shared/components/TablePagination';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import useDebouncedSearch from '../../shared/hooks/useDebouncedSearch';
import useConfirmDelete from '../../shared/hooks/useConfirmDelete';
import useDoctors from '../hooks/useDoctors';
import { deleteDoctor } from '../services/doctorsService';

const PAGE_SIZE = 10;

function DoctorsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [page, setPage] = useState(1);

  // "Ver Detalle" del Tablero llega con el nombre del médico ya buscado
  const { searchTerm, setSearchTerm, search } = useDebouncedSearch({
    initial: state?.search ?? '',
  });

  const { doctors, total, loading, error, reload } = useDoctors({
    page,
    pageSize: PAGE_SIZE,
    name: search,
  });

  const {
    toDelete,
    askDelete,
    cancelDelete,
    confirmDelete,
    deleting,
    deleteError,
  } = useConfirmDelete(deleteDoctor, () => {
    if (doctors.length === 1 && page > 1) setPage(page - 1);
    else reload();
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      {/* Título y Acciones de Cabecera */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Directorio de Doctores
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Gestione el personal médico y su disponibilidad horaria.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Barra de Búsqueda */}
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
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
              placeholder="Buscar doctor por nombre (mín. 3 letras)..."
              aria-label="Buscar doctor por nombre"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>

          <Button
            onClick={() => navigate('/admin/doctors/availability')}
            className="flex items-center gap-1.5"
          >
            <span>⏱</span>
            <span>Agregar Disponibilidad Horaria</span>
          </Button>

          <Button
            onClick={() => navigate('/admin/doctors/new')}
            className="flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Nuevo Doctor</span>
          </Button>
        </div>
      </div>

      {/* Tabla Principal */}
      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Doctores
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-6 py-3.5">Nombre del Doctor</th>
                <th className="px-6 py-3.5">Especialidad</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border-subtle">
              {loading && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-10 text-center text-med-text-muted"
                  >
                    Cargando doctores...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center">
                    <p className="text-med-danger-text">{error}</p>
                    <button
                      type="button"
                      onClick={reload}
                      className="mt-2 text-xs font-semibold text-med-primary-700 underline"
                    >
                      Reintentar
                    </button>
                  </td>
                </tr>
              )}

              {!loading && !error && doctors.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-10 text-center text-med-text-muted"
                  >
                    {search
                      ? `No hay doctores que coincidan con "${search}".`
                      : 'Todavía no hay doctores cargados.'}
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                doctors.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    {/* Doctor Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-med-primary-100 text-med-primary-700 flex items-center justify-center shrink-0 font-bold">
                          {doc.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-med-primary-900 leading-tight">
                            {doc.name}
                          </p>
                          <p className="text-xs text-med-text-muted mt-0.5">
                            Matrícula: {doc.licenseNumber || '—'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Especialidad Badge en Píldora */}
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700">
                        {doc.specialty?.name ?? 'Sin especialidad'}
                      </span>
                    </td>

                    {/* Acciones: Disponibilidad y Eliminar */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          title="Disponibilidad horaria"
                          aria-label={`Disponibilidad de ${doc.name}`}
                          className="p-1.5 rounded-lg hover:bg-med-primary-50 text-med-primary-600 hover:text-med-primary-900 transition"
                          onClick={() =>
                            navigate(`/admin/doctors/${doc.id}/availability`)
                          }
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          title="Eliminar doctor"
                          aria-label={`Eliminar ${doc.name}`}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-med-danger-text transition"
                          onClick={() => askDelete(doc)}
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </Card>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminar doctor"
        message={`¿Seguro que querés eliminar a "${toDelete?.name}"? Dejará de aparecer en el listado y en la reserva de turnos.`}
        confirmText="Eliminar"
        loading={deleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default DoctorsPage;
