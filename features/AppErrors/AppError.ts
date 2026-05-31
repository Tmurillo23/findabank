export enum ErrorSeverity {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export interface ErrorContext {
    [key: string]: unknown;
}

export class AppError extends Error {
    public readonly name: string;
    public readonly isRetryable: boolean;
    public readonly severity: ErrorSeverity;
    public readonly context: ErrorContext;
    public readonly originalError?: unknown;
    public readonly errorCode: string;

    constructor(
        message: string,
        public statusCode: number = 500,
        options: {
            isRetryable?: boolean;
            severity?: ErrorSeverity;
            context?: ErrorContext;
            originalError?: unknown;
            errorCode?: string;
        } = {}
    ) {
        super(message);
        this.name = this.constructor.name;
        this.isRetryable = options.isRetryable ?? false;
        this.severity = options.severity ?? ErrorSeverity.MEDIUM;
        this.context = options.context ?? {};
        this.originalError = options.originalError;
        this.errorCode = options.errorCode ?? 'ERR_UNKNOWN';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }


}