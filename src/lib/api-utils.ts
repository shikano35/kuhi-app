const DEFAULT_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'User-Agent': 'kuhi-app/1.0 (https://kuhi.jp)',
};

export async function simpleFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...DEFAULT_HEADERS,
        ...options.headers,
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
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
