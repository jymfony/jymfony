const BaseException = globalThis.BadMethodCallException;
const ExceptionInterface = Jymfony.Contracts.DependencyInjection.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
export default class BadMethodCallException extends mix(BaseException, ExceptionInterface) {
}
