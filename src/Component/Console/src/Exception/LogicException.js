const BaseException = global.LogicException;
const ExceptionInterface = Jymfony.Component.Console.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Console.Exception
 */
export default class LogicException extends mix(BaseException, ExceptionInterface) {
}
