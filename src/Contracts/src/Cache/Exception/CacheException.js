const ExceptionInterface = Jymfony.Contracts.Cache.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Contracts.Cache.Exception
 */
export default class CacheException extends mix(globalThis.Exception, ExceptionInterface) {
}
