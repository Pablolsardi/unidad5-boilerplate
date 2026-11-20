import { useId } from 'react';

// Átomo de select con el mismo contrato que Input: label, error y props nativas.
// Las opciones se pasan por composición (children).
function Select({
  label,
  error = '',
  id,
  className = '',
  children,
  ...restProps
}) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold text-med-text-main"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`w-full appearance-none pl-3.5 pr-10 py-2.5 text-sm bg-white border rounded-lg text-med-text-main cursor-pointer focus:outline-none focus:ring-2 focus:ring-med-primary-600 disabled:bg-gray-50 disabled:cursor-not-allowed ${
            error ? 'border-red-400' : 'border-med-border'
          } ${className}`}
          {...restProps}
        >
          {children}
        </select>
        <span
          aria-hidden="true"
          className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-med-text-muted"
        >
          ▼
        </span>
      </div>
      {error && (
        <p id={errorId} className="text-xs text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

export default Select;
