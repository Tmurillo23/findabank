

import {
    AppError,
    NotFoundError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    DatabaseError,
    SupabaseError,
    SignUpError,
    ErrorSeverity
} from '@/features/AppErrors';

interface SupabaseErrorResponse {
    code?: string;
    message?: string;
    details?: string;
    hint?: string;
}

function isSupabaseError(error: unknown): error is SupabaseErrorResponse {
    if (!error || typeof error !== 'object') return false;
    const err = error as Record<string, unknown>;
    return typeof err.code === 'string' || typeof err.message === 'string';
}


export function mapSupabaseError(error: unknown): AppError | null {
    if (error instanceof AppError) {
        return error;
    }

    const supabaseError = error as SupabaseErrorResponse;
    const errorCode = supabaseError.code?.toUpperCase() || '';
    const errorMessage = supabaseError.message || 'Unknown Supabase error';
    const errorDetails = supabaseError.details || supabaseError.hint || '';

    if (errorCode === 'PGRST116' || errorCode === '404') {
        return null;
    }

    if (
        errorCode === 'INVALID_CREDENTIALS' ||
        errorCode === 'USER_NOT_FOUND' ||
        errorCode === '401' ||
        errorMessage.toLowerCase().includes('invalid login credentials')
    ) {
        return new AuthenticationError(
            'Authentication failed. Please check your credentials.',
            {
                originalCode: errorCode,
                details: errorDetails
            }
        );
    }

    if (errorCode === 'PGRST301' || errorCode === '403') {
        return new AuthorizationError(
            'You do not have permission to perform this action',
            {
                originalCode: errorCode,
                details: errorDetails
            }
        );
    }

    if (
        errorCode === '23505' || 
        errorCode === '23502' || 
        errorCode === '23503' || 
        errorCode.startsWith('ERR_CONSTRAINT')
    ) {
        const constraintMessage = errorCode === '23505'
            ? 'This record already exists'
            : 'Invalid data provided';

        return new ValidationError(
            constraintMessage,
            {
                originalCode: errorCode,
                details: errorDetails,
                originalMessage: errorMessage
            }
        );
    }

    if (
        errorCode === '42P01' || // Undefined table
        errorCode === '42703' || // Undefined column
        errorCode === '42601' || // Syntax error
        errorCode.startsWith('42')
    ) {
        return new DatabaseError(
            'Database operation failed. Please try again later.',
            500,
            {
                originalCode: errorCode,
                details: errorDetails,
                originalMessage: errorMessage
            },
            error
        );
    }

    return new SupabaseError(
        errorMessage,
        {
            originalCode: errorCode,
            details: errorDetails,
            hint: supabaseError.hint
        },
        error
    );
}


export function mapSignUpError(error: unknown): AppError | null {
    if (error instanceof AppError) {
        return error;
    }

    const supabaseError = error as SupabaseErrorResponse;
    const errorCode = supabaseError.code?.toUpperCase() || '';
    const errorMessage = supabaseError.message || 'Unknown sign-up error';
    const errorDetails = supabaseError.details || supabaseError.hint || '';

    // Email ya existe
    if (errorCode === '23505' && errorMessage.toLowerCase().includes('email')) {
        return new SignUpError(
            'Este correo electrónico ya está registrado',
            {
                originalCode: errorCode,
                details: errorDetails,
                originalMessage: errorMessage
            }
        );
    }



    if (errorMessage.toLowerCase().includes('email') || errorCode === 'invalid_email') {
        return new SignUpError(
            'El correo electrónico no es válido',
            {
                originalCode: errorCode,
                details: errorDetails,
                originalMessage: errorMessage
            }
        );
    }

    const mappedError = mapSupabaseError(error);
    if (mappedError === null) {
        return null;
    }
    if (mappedError instanceof SignUpError) {
        return mappedError;
    }
    if (mappedError instanceof ValidationError || mappedError instanceof AuthenticationError) {
        return new SignUpError(
            mappedError.message,
            {
                originalCode: errorCode,
                details: errorDetails,
                originalMessage: errorMessage
            }
        );
    }
    return null;
}


export function normalizeError(error: unknown): AppError {
    if (error instanceof AppError) {
        return error;
    }

    if (isSupabaseError(error)) {
        const mappedError = mapSupabaseError(error);
        if (mappedError !== null) {
            return mappedError;
        }
        return new NotFoundError(
            'Resource not found',
            { originalError: error }
        );
    }

    if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (
            message.includes('pgrst') ||
            message.includes('constraint') ||
            message.includes('not found')
        ) {
            const mappedError = mapSupabaseError(error);
            if (mappedError !== null) {
                return mappedError;
            }
            return new NotFoundError(
                'Resource not found',
                { originalError: error }
            );
        }

        return new AppError(
            error.message,
            500,
            {
                context: { originalMessage: error.message },
                originalError: error,
                severity: ErrorSeverity.HIGH
            }
        );
    }

    const unknownMessage = typeof error === 'string' ? error : JSON.stringify(error);
    return new AppError(
        unknownMessage || 'An unexpected error occurred',
        500,
        {
            originalError: error,
            severity: ErrorSeverity.CRITICAL
        }
    );
}


export function isRetryableError(error: unknown): boolean {
    if (error instanceof AppError) {
        return error.isRetryable;
    }
    return false;
}


export function isAuthenticationError(error: unknown): error is AuthenticationError {
    return error instanceof AuthenticationError;
}


export function isAuthorizationError(error: unknown): error is AuthorizationError {
    return error instanceof AuthorizationError;
}


export function isNotFoundError(error: unknown): error is NotFoundError {
    return error instanceof NotFoundError;
}


export function isSignUpError(error: unknown): error is SignUpError {
    return error instanceof SignUpError;
}

