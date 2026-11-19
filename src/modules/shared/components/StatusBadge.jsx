const STATUS_CONFIG = {
  BOOKED: {
    label: 'Reservado',
    className: 'bg-med-active-bg text-med-active-text',
  },
  ATTENDED: { label: 'Atendido', className: 'bg-slate-100 text-slate-700' },
  CANCELLED: {
    label: 'Cancelado',
    className: 'bg-med-danger-bg text-med-danger-text',
  },
  NO_SHOW: {
    label: 'Ausente',
    className: 'bg-med-leave-bg text-med-leave-text',
  },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: 'bg-gray-100 text-gray-700',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}

export default StatusBadge;
