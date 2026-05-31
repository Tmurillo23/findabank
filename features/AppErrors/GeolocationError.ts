import { AppError, ErrorSeverity, ErrorContext } from './AppError';

export class GeolocationError extends AppError {
    constructor(
        message: string,
        context?: ErrorContext,
        originalError?: unknown
    ) {
        super(message, 400, {
            isRetryable: true,
            severity: ErrorSeverity.MEDIUM,
            context,
            originalError,
            errorCode: 'ERR_GEOLOCATION'
        });
    }
}

