import { AppError, ErrorSeverity, ErrorContext } from './AppError';

export class NotFoundError extends AppError {
    constructor(
        message = 'Resource not found',
        context?: ErrorContext
    ) {
        super(message, 404, {
            isRetryable: false,
            severity: ErrorSeverity.MEDIUM,
            context,
            errorCode: 'ERR_NOT_FOUND'
        });
    }
}