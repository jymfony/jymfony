const ConfigCache = Jymfony.Component.Config.ConfigCache;
const ConfigCacheFactoryInterface = Jymfony.Component.Config.ConfigCacheFactoryInterface;

/**
 * Basic implementation of ConfigCacheFactoryInterface that
 * creates an instance of the default ConfigCache.
 *
 * This factory and/or cache <em>do not</em> support cache validation
 * by means of ResourceChecker instances (that is, service-based).
 *
 * @memberOf Jymfony.Component.Config
 */
export default class ConfigCacheFactory extends implementationOf(ConfigCacheFactoryInterface) {
    /**
     * Constructor.
     *
     * @param {boolean} debug
     */
    __construct(debug) {
        this._debug = debug;
    }

    /**
     * @inheritdoc
     */
    cache(file, callable) {
        if (! isFunction(callable)) {
            throw new InvalidArgumentException(
                __jymfony.sprintf('Invalid type for callback argument. Expected callable, but got "%s".', typeof callable)
            );
        }

        const cache = new ConfigCache(file, this._debug);
        if (! cache.isFresh()) {
            callable(cache);
        }

        return cache;
    }
}
