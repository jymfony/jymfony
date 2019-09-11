const BaseException = global.InvalidArgumentException;
const ExceptionInterface = Jymfony.Component.Cache.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Cache.Exception
 */
export default class InvalidArgumentException extends mix(BaseException, ExceptionInterface) {
}
