// Logo + nombre que comparten las pantallas de login (paciente y admin).
function AuthBrandHeader() {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-3">
        <svg
          className="w-8 h-8 text-med-primary-900"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-white">
        MedPortal
      </h1>
    </div>
  );
}

export default AuthBrandHeader;
