import { AppError, ErrorSeverity, ErrorContext } from './AppError';

export class SupabaseError extends AppError {
    constructor(
        message: string,
        context?: ErrorContext,
        originalError?: unknown
    ) {
        super(message, 500, {
            isRetryable: true,
            severity: ErrorSeverity.HIGH,
            context,
            originalError,
            errorCode: 'ERR_SUPABASE'
        });
    }
}