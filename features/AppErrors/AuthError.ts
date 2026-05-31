import { AppError, ErrorSeverity, ErrorContext } from './AppError';

export class AuthenticationError extends AppError {
    constructor(
        message = 'Authentication required',
        context?: ErrorContext
    ) {
        super(message, 401, {
            isRetryable: false,
            severity: ErrorSeverity.HIGH,
            context,
            errorCode: 'ERR_AUTHENTICATION'
        });
    }
}