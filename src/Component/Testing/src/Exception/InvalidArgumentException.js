const BaseException = globalThis.InvalidArgumentException;
const ExceptionInterface = Jymfony.Component.Testing.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Testing.Exception
 */
export default class InvalidArgumentException extends mix(BaseException, ExceptionInterface) {
}
