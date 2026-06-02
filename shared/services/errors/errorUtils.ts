import { AppError } from '@/features/AppErrors';


export type Result<T, E = AppError> =
    | { ok: true; value: T }
    | { ok: false; error: E };


export function ok<T>(value: T): Result<T> {
    return { ok: true, value };
}


export function err<E = AppError>(error: E): Result<never, E> {
    return { ok: false, error };
}


export function unwrap<T>(result: Result<T>): T {
    if (result.ok) return result.value;
    throw result.error;
}


export function mapResult<T, U>(result: Result<T>, fn: (value: T) => U): Result<U> {
    if (!result.ok) return result;
    return ok(fn(result.value));
}


export async function chain<T, U, E = AppError>(
    result: Promise<Result<T, E>>,
    fn: (value: T) => Promise<Result<U, E>>
): Promise<Result<U, E>> {
    const res = await result;
    if (!res.ok) return res;
    return fn(res.value);
}


export async function fromPromise<T>(
    promise: Promise<T>
): Promise<Result<T>> {
    const value = await promise;
    return ok(value);
}

