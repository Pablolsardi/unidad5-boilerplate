import { useId } from 'react';

// Átomo de input. Extensible sin tocar su código: acepta todas las props
// nativas de <input> (incluido el ref de react-hook-form) y un ícono opcional.
function Input({
  label,
  error = '',
  icon = null,
  id,
  className = '',
  ...restProps
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-med-text-main"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-med-text-muted">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`w-full border rounded-lg py-2.5 text-sm bg-white text-med-text-main placeholder-med-text-muted transition focus:outline-none focus:ring-2 focus:ring-med-primary-600 focus:border-transparent ${
            icon ? 'pl-10 pr-3.5' : 'px-3.5'
          } ${
            error ? 'border-red-400 bg-red-50/20' : 'border-med-border'
          } ${className}`}
          {...restProps}
        />
      </div>
      {error && (
        <p id={errorId} className="text-xs text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
