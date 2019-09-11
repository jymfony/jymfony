const BaseException = global.LogicException;
const ExceptionInterface = Jymfony.Component.Logger.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Logger.Exception
 */
export default class LogicException extends mix(BaseException, ExceptionInterface) {
}
