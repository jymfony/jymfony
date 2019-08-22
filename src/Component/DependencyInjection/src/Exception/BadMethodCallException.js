const BaseException = global.BadMethodCallException;
const ExceptionInterface = Jymfony.Component.DependencyInjection.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
export default class BadMethodCallException extends mix(BaseException, ExceptionInterface) {
}
