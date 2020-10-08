const BaseException = global.LogicException;
const ExceptionInterface = Jymfony.Contracts.Logger.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Contracts.Logger.Exception
 */
export default class LogicException extends mix(BaseException, ExceptionInterface) {
}
