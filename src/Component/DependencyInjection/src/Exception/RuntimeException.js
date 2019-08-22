const BaseException = global.RuntimeException;
const ExceptionInterface = Jymfony.Component.DependencyInjection.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
export default class RuntimeException extends mix(BaseException, ExceptionInterface) {
}
