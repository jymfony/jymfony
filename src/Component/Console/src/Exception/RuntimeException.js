const BaseException = globalThis.RuntimeException;
const ExceptionInterface = Jymfony.Component.Console.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Console.Exception
 */
export default class RuntimeException extends mix(BaseException, ExceptionInterface) {
}
