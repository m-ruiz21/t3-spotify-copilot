/* 
A series of funciton that "dresses up" fp-ts's Either type to be more like Rusts' Result exceptional monad.

I made it because I hate try / catch blocks and wanted to make a more functional way of handling errors.
Also, I belive the rust Result (with err and ok) type is more readable than Either (with left and right).
*/

import { Either, left, right, isLeft, isRight, getOrElse, Right, Left } from 'fp-ts/lib/Either';
import { ErrorWithCode } from '@/common/models/error-with-code';

/**
 * Exceptional monad representing either the success or failure of an operation.
 */
export type Result<T, E> = Either<E, T> 

/**
 * Monad "wrapper" types directly representing failure / success
 * Think of them almost as subtypes of Result
 */
type Err<E> = Either<E, never>; 
type Ok<T> = Either<never, T>; 

/**
 * Wrap function to create error result monad 
 * 
 * @param e         function error (preferably an ErrorWithCode object, but anything works)
 */ 
export const Err = <E>(e: E): Err<E> => left(e);

/**
 * Wrap function to create successful result monad 
 * 
 * @param t         successful task value
 */
export const Ok = <T>(t: T): Ok<T> => right(t);

/**
 * Checks if result state 
 *  
 * @param result   
 * @returns         true if result is Err, false otherwise
 */
export const isErr = <T, E>(result: Result<T, E>): result is Left<E> => isLeft(result); 
export const isOk = <T, E>(result: Result<T, E>): result is Right<T> => isRight(result);

/**
 * The "bind" or "run" function of the Result exceptional monad. Runs the transformation function on the given the result value or returns previous Err state.
 *  
 * @param result    Result type representing either a success or failure of previous operation.
 * @param f         Function to run on the result  
 * @returns         Result containing function call result or previous error. New errors are wrapped in an ErrorWithCode object for simplicity.
 * @example
 * const result = Ok(6);
 * const value = map(result, (value) => value + 1); // Ok(7) 
 */
export const map = <T, E, R>(result: Result<T, E>, f: (value: T) => R): Result<R, E | ErrorWithCode> => {
    if (isOk(result)) {
        try {
            return Ok(f(result.right));
        } catch (error) {
            if (error instanceof Error) {
                return Err<ErrorWithCode>({message: error.message, status: 500});
            }
            
            return Err<ErrorWithCode>({message: "Unknown Error Occured", status: 500});
        }
    } else {
        return result; 
    }
};

/**
 * Async version of map. Runs async function on result
 * 
 * @see map 
 * @param result    Result type representing either a success or failure of previous operation.
 * @param f         Async function to run on the result 
 * @returns         Result containing function call result or previous error. New errors are wrapped in an ErrorWithCode object for simplicity. 
 * 
 * @example
 * const result = Ok("app.com/api");
 * const data = await mapAsync(result, async (url) => fetch(url));  
 */
export const mapAsync = async <T, E, R>(result: Result<T, E>, f: (value: T) => Promise<R>): Promise<Result<R, E>> => {
    if (isOk(result)) {
        return Ok(await f(result.right));
    } else {
        return result; 
    }
}

/**
 * Unwraps value from result monad. Throws error if result is Err.
 * 
 * @param result    
 * @returns         value of result monad
 * @throws          error E if result is Err 
 */
export const unwrap = <T, E>(result: Result<T, E>): T => {
    if (isOk(result)) {
        return result.right;
    } else {
        throw result.left;
    }
}

/**
 * match function for result monad. Runs okFn if result is Ok, errFn if result is Err. 
 * 
 * @example
 * const result = Ok(5);
 * const value = match(result)(
 *      (value) => value + 1,
 *      (error) => 0
 * );
 */
export const match = <T, E>(result: Result<T, E>) => 
  <R1, R2>(okFn: (value: T) => R1, errFn: (error: E) => R2): R1 | R2 => {
    if (isOk(result)) {
        return okFn(result.right);
    } else {
        return errFn(result.left);
    }
};