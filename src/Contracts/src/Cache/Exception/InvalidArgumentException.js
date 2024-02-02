const BaseException = globalThis.InvalidArgumentException;
const ExceptionInterface = Jymfony.Contracts.Cache.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Contracts.Cache.Exception
 */
export default class InvalidArgumentException extends mix(BaseException, ExceptionInterface) {
}
