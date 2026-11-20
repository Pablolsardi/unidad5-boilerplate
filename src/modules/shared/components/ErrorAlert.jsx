// Caja de error reutilizable. Si no hay mensaje no renderiza nada,
// así se puede usar directo: <ErrorAlert>{error}</ErrorAlert>
function ErrorAlert({ children, className = '' }) {
  if (!children) return null;

  return (
    <p
      role="alert"
      className={`rounded-lg bg-med-danger-bg px-3 py-2 text-xs text-med-danger-text ${className}`}
    >
      {children}
    </p>
  );
}

export default ErrorAlert;
