export async function simpleFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(url, options);
}

export function createErrorResponse(
  error: unknown,
  defaultMessage: string,
  _defaultStatus = 500
) {
  if (error instanceof Response) {
    return {
      error: defaultMessage,
      status: error.status,
      message: 'API request failed',
    };
  }

  return {
    error: defaultMessage,
    details: error instanceof Error ? error.message : 'Unknown error',
  };
}
