const BaseException = globalThis.RuntimeException;
const ExceptionInterface = Jymfony.Component.Testing.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Testing.Exception
 */
export default class RuntimeException extends mix(BaseException, ExceptionInterface) {
}
