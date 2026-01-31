import { toast as sonnerToast } from 'sonner';
import { getErrorMessage } from './errors';

/** Re-export base toast for direct usage (use toast.success, toast.error, etc.) */
export { toast } from 'sonner';

/**
 * Show an error toast with a user-friendly message.
 */
export function toastError(error: unknown, fallback = 'Something went wrong. Please try again.') {
  const message = getErrorMessage(error, fallback);
  sonnerToast.error(message);
  return message;
}

/**
 * Show a success toast.
 */
export function toastSuccess(message: string) {
  sonnerToast.success(message);
}

/**
 * Show an info toast.
 */
export function toastInfo(message: string) {
  sonnerToast.info(message);
}

/**
 * Show a warning toast.
 */
export function toastWarning(message: string) {
  sonnerToast.warning(message);
}

/**
 * Show a loading toast and return the toast id for dismissal.
 */
export function toastLoading(message: string) {
  return sonnerToast.loading(message);
}

/**
 * Dismiss a toast by id (from toastLoading).
 */
export function toastDismiss(id?: string | number) {
  sonnerToast.dismiss(id);
}
