const BaseException = globalThis.InvalidArgumentException;
const ExceptionInterface = Jymfony.Contracts.DependencyInjection.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.EventDispatcher.Exception
 */
export default class InvalidArgumentException extends mix(BaseException, ExceptionInterface) {
}
