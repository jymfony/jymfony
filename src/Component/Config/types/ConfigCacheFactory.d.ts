declare namespace Jymfony.Component.Config {
    /**
     * Basic implementation of ConfigCacheFactoryInterface that
     * creates an instance of the default ConfigCache.
     *
     * This factory and/or cache <em>do not</em> support cache validation
     * by means of ResourceChecker instances (that is, service-based).
     */
    export class ConfigCacheFactory extends implementationOf(ConfigCacheFactoryInterface) {
        /**
         * Constructor.
         */
        __construct(debug: boolean): void;
        constructor(debug: boolean);

        /**
         * @inheritdoc
         */
        cache(file: string, callable: Invokable): ConfigCacheInterface;
    }
}
