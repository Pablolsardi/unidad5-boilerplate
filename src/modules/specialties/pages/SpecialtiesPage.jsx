import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import TablePagination from '../../shared/components/TablePagination';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import {
  getSpecialties,
  deleteSpecialty,
} from '../services/specialtiesService';

const PAGE_SIZE = 10;
const MIN_SEARCH_LENGTH = 3; 

function SpecialtiesPage() {
  const navigate = useNavigate();

  const [specialties, setSpecialties] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const term = searchTerm.trim();

      setSearch(term.length >= MIN_SEARCH_LENGTH ? term : '');
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const loadSpecialties = useCallback(async () => {
    setLoading(true);
    setError('');

    const { data, error } = await getSpecialties({
      pageIndex: page,
      pageSize: PAGE_SIZE,
      name: search,
    });

    if (error) {
      setError(error.message);
      setSpecialties([]);
      setTotal(0);
    } else {
      setSpecialties(data.data);
      setTotal(data.total);
    }

    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    loadSpecialties();
  }, [loadSpecialties]);

  const closeDeleteDialog = () => {
    setToDelete(null);
    setDeleteError('');
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError('');

    const { error } = await deleteSpecialty(toDelete.id);

    setDeleting(false);

    if (error) {
      setDeleteError(error.message);

      return;
    }

    closeDeleteDialog();

    if (specialties.length === 1 && page > 1) {
      setPage(page - 1);
    } else {
      loadSpecialties();
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Directorio de Especialidades
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Administre las categorías médicas del centro.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">

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
              placeholder="Buscar especialidad (mín. 3 letras)..."
              aria-label="Buscar especialidad por nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>

          <Button
            onClick={() => navigate('/admin/specialties/new')}
            className="flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Nueva Especialidad</span>
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Especialidades
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-6 py-3.5">Nombre de la Especialidad</th>
                <th className="px-6 py-3.5">Descripción</th>
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
                    Cargando especialidades...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center">
                    <p className="text-med-danger-text">{error}</p>
                    <button
                      type="button"
                      onClick={loadSpecialties}
                      className="mt-2 text-xs font-semibold text-med-primary-700 underline"
                    >
                      Reintentar
                    </button>
                  </td>
                </tr>
              )}

              {!loading && !error && specialties.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-10 text-center text-med-text-muted"
                  >
                    {search
                      ? `No hay especialidades que coincidan con "${search}".`
                      : 'Todavía no hay especialidades cargadas.'}
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                specialties.map((spec) => (
                  <tr
                    key={spec.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-med-primary-100 text-med-primary-700 flex items-center justify-center shrink-0 font-bold">
                          {spec.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-med-primary-900">
                          {spec.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-med-text-sub max-w-md">
                      {spec.description}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        title="Eliminar especialidad"
                        aria-label={`Eliminar ${spec.name}`}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-med-danger-text transition"
                        onClick={() => setToDelete(spec)}
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
        title="Eliminar especialidad"
        message={`¿Seguro que querés eliminar "${toDelete?.name}"? Dejará de aparecer en el listado.`}
        confirmText="Eliminar"
        loading={deleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={closeDeleteDialog}
      />
    </div>
  );
}

export default SpecialtiesPage;