const BaseException = globalThis.InvalidArgumentException;
const ExceptionInterface = Jymfony.Component.Console.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Console.Exception
 */
export default class InvalidArgumentException extends mix(BaseException, ExceptionInterface) {
}
