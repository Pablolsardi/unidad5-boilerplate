import { useEffect, useState } from 'react';
import { searchAppointments } from '../services/appointmentsService';

const PAGE_SIZE = 10;

function useAppointmentsSearch() {
  const [appointments, setAppointments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');

      const { data, error } = await searchAppointments({
        ...filters,
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
  }, [filters, page]);

  const applyFilters = (newFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setPage(1);
    setFilters({});
  };

  return {
    appointments,
    loading,
    error,
    page,
    setPage,
    total,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    pageSize: PAGE_SIZE,
    filters,
    applyFilters,
    clearFilters,
  };
}

export default useAppointmentsSearch;
