const ExceptionInterface = Jymfony.Component.Cache.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Cache.Exception
 */
export default class CacheException extends mix(global.Exception, ExceptionInterface) {
}
