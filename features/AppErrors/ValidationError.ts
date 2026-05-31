import { AppError, ErrorSeverity, ErrorContext } from './AppError';

export class ValidationError extends AppError {
    constructor(
        message: string,
        context?: ErrorContext
    ) {
        super(message, 400, {
            isRetryable: false,
            severity: ErrorSeverity.MEDIUM,
            context,
            errorCode: 'ERR_VALIDATION'
        });
    }
}