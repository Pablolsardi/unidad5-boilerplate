import { useState } from 'react';

function useConfirmDelete(deleteFn, onDeleted) {
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const cancelDelete = () => {
    setToDelete(null);
    setDeleteError('');
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setDeleteError('');

    const { error } = await deleteFn(toDelete.id);

    setDeleting(false);

    if (error) {
      setDeleteError(error.message);

      return;
    }

    cancelDelete();
    onDeleted();
  };

  return {
    toDelete,
    askDelete: setToDelete,
    cancelDelete,
    confirmDelete,
    deleting,
    deleteError,
  };
}

export default useConfirmDelete;
