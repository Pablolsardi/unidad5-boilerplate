import { getErrorMessage, statusToCode } from './errorMessages';

// Normaliza cualquier error de Axios a { code, message, details }.
function toApiError(err) {
  if (!err.response) {
    return {
      code: 'NETWORK_ERROR',
      message: getErrorMessage('NETWORK_ERROR'),
      details: [],
    };
  }

  const { status, data } = err.response;
  const code = data?.errorCode ?? statusToCode[status] ?? 'UNKNOWN_ERROR';

  return {
    code,
    message: getErrorMessage(code),
    details: Array.isArray(data?.details) ? data.details : [],
  };
}

// Ejecuta una request y devuelve siempre { data, error }; nunca lanza.
async function apiRequest(request) {
  try {
    const response = await request();

    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: toApiError(err) };
  }
}

export { apiRequest, toApiError };
