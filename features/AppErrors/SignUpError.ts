import { AppError, ErrorSeverity, ErrorContext } from './AppError';

export class SignUpError extends AppError {
    constructor(
        message = 'Sign up failed',
        context?: ErrorContext
    ) {
        super(message, 400, {
            isRetryable: false,
            severity: ErrorSeverity.MEDIUM,
            context,
            errorCode: 'ERR_SIGNUP'
        });
    }
}

