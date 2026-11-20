// Traduce los errorCode del backend a mensajes para el usuario.
const errorMessages = {
  // Autenticación
  AUTHENTICATION_FAILED: 'Email y/o contraseña incorrectos.',
  AUTHORIZATION_FAILED: 'No tenés permisos para realizar esta acción.',
  PATIENT_LOGIN_INVALID: 'Email y/o DNI incorrectos.',
  PATIENT_DNI_CONFLICT: 'El DNI ya está registrado con otro email.',
  PATIENT_LOGIN_CONFLICT: 'El email ya está registrado con otro DNI.',
  REGISTER_USER_INVALID: 'Los datos del administrador no son válidos.',
  REGISTER_USER_CONFLICT: 'No se pudo registrar el administrador.',

  // Turnos
  APPOINTMENT_CONFLICT: 'El turno ya fue reservado. Elegí otro horario.',
  APPOINTMENT_PAST_DATE: 'No se pueden reservar turnos en el pasado.',
  APPOINTMENT_CANCEL_INVALID: 'Este turno no se puede cancelar.',
  APPOINTMENT_SLOT_MISMATCH: 'El horario no corresponde al médico elegido.',

  // Datos y validación
  AVAILABILITY_CONFLICT: 'Hay horarios superpuestos en la disponibilidad.',
  SPECIALITY_DUPLICATED: 'Ya existe una especialidad con ese nombre.',
  DOCTOR_NAME_INVALID: 'El nombre del médico no es válido.',
  ENTITY_NOTFOUND: 'El recurso solicitado no existe.',
  VALIDATION_ERROR: 'Hay datos inválidos en el formulario.',

  // Generales
  TOO_MANY_REQUESTS: 'Demasiadas solicitudes. Esperá unos segundos.',
  UNHANDLED_ERROR: 'Ocurrió un error en el servidor. Intentá más tarde.',
  NETWORK_ERROR: 'No se pudo conectar con el servidor.',
  UNKNOWN_ERROR: 'Ocurrió un error inesperado.',
};

const statusToCode = {
  401: 'AUTHENTICATION_FAILED',
  403: 'AUTHORIZATION_FAILED',
  404: 'ENTITY_NOTFOUND',
  429: 'TOO_MANY_REQUESTS',
  500: 'UNHANDLED_ERROR',
};

function getErrorMessage(code) {
  return errorMessages[code] ?? errorMessages.UNKNOWN_ERROR;
}

export { errorMessages, statusToCode, getErrorMessage };
