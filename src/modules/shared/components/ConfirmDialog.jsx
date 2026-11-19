import Button from './Button';

function ConfirmDialog({
  open,
  title = '¿Estás seguro?',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
  error = '',
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={loading ? undefined : onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="confirm-dialog-title"
          className="text-lg font-bold text-med-text-main"
        >
          {title}
        </h2>

        {message && <p className="mt-2 text-sm text-med-text-sub">{message}</p>}

        {error && (
          <p className="mt-3 rounded-lg bg-med-danger-bg px-3 py-2 text-xs text-med-danger-text">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Procesando...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;