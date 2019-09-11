const BaseException = global.InvalidArgumentException;
const ExceptionInterface = Jymfony.Component.Console.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Console.Exception
 */
export default class InvalidOptionException extends mix(BaseException, ExceptionInterface) {
}
