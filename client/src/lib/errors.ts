/**
 * Centralized error handling utilities for the frontend.
 * Extracts user-friendly messages from various error types.
 */

/** API error with status code for handling different failure types */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Network error (fetch failed, no response) */
export class NetworkError extends Error {
  constructor(message = 'Network error. Please check your connection.') {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Extract a user-friendly error message from any thrown value.
 */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error instanceof ApiError) {
    return error.message || fallback;
  }
  if (error instanceof NetworkError) {
    return error.message;
  }
  if (error instanceof Error) {
    const msg = error.message?.trim();
    if (msg) return msg;
  }
  if (typeof error === 'string' && error.trim()) {
    return error.trim();
  }
  if (error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
    return (error as { message: string }).message;
  }
  return fallback;
}

/**
 * Check if an error indicates the user should re-authenticate.
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof ApiError && error.status === 401) return true;
  if (error instanceof Error && /unauthorized|auth|token|session/i.test(error.message)) return true;
  return false;
}

/**
 * Check if an error is likely a network/connectivity issue.
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof NetworkError) return true;
  if (error instanceof TypeError && error.message?.includes('fetch')) return true;
  if (error instanceof Error) {
    const m = error.message?.toLowerCase() ?? '';
    return m.includes('network') || m.includes('failed to fetch') || m.includes('connection');
  }
  return false;
}
