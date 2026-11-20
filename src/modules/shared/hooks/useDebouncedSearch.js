import { useEffect, useState } from 'react';

function useDebouncedSearch({ initial = '', minLength = 3, delay = 400 } = {}) {
  const [searchTerm, setSearchTerm] = useState(initial);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const term = searchTerm.trim();

      setSearch(term.length >= minLength ? term : '');
    }, delay);

    return () => clearTimeout(timeout);
  }, [searchTerm, minLength, delay]);

  return { searchTerm, setSearchTerm, search };
}

export default useDebouncedSearch;
