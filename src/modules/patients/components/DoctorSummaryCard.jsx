import Card from '../../shared/components/Card';

// Recibe solo los datos que muestra (no el objeto doctor entero).
function DoctorSummaryCard({ name, specialtyName, licenseNumber }) {
  return (
    <Card className="p-5 sm:p-6 flex items-center gap-4">
      <div
        aria-hidden="true"
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-med-primary-100 flex items-center justify-center text-3xl border border-med-primary-200 shrink-0"
      >
        🩺
      </div>

      <div className="overflow-hidden">
        <h2 className="text-base sm:text-lg font-bold text-med-primary-900">
          {name}
        </h2>
        {specialtyName && (
          <p className="text-xs sm:text-sm font-semibold text-med-primary-700 mt-0.5">
            {specialtyName}
          </p>
        )}
        {licenseNumber && (
          <p className="text-xs text-med-text-muted mt-0.5">
            Matrícula: {licenseNumber}
          </p>
        )}
      </div>
    </Card>
  );
}

export default DoctorSummaryCard;
