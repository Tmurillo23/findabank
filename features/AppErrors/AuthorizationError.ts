import { AppError, ErrorSeverity, ErrorContext } from './AppError';

export class AuthorizationError extends AppError {
    constructor(
        message = 'Access denied',
        context?: ErrorContext
    ) {
        super(message, 403, {
            isRetryable: false,
            severity: ErrorSeverity.HIGH,
            context,
            errorCode: 'ERR_AUTHORIZATION'
        });
    }
}