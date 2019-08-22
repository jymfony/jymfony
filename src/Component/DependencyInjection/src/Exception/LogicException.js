const BaseException = global.LogicException;
const ExceptionInterface = Jymfony.Component.DependencyInjection.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
export default class LogicException extends mix(BaseException, ExceptionInterface) {
}
