import { AppError, ErrorSeverity, ErrorContext } from './AppError';


export class DatabaseError extends AppError {
    constructor(
        message: string,
        statusCode: number = 500,
        context?: ErrorContext,
        originalError?: unknown
    ) {
        super(message, statusCode, {
            isRetryable: false,
            severity: ErrorSeverity.HIGH,
            context,
            originalError,
            errorCode: 'ERR_DATABASE'
        });
    }
}

