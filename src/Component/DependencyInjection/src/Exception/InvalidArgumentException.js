const BaseException = global.InvalidArgumentException;
const ExceptionInterface = Jymfony.Contracts.DependencyInjection.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
export default class InvalidArgumentException extends mix(BaseException, ExceptionInterface) {
}
