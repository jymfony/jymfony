const ExceptionInterface = Jymfony.Component.Cache.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Cache.Exception
 */
class CacheException extends mix(global.Exception, ExceptionInterface) {
}

module.exports = CacheException;
