const LoaderInterface = Jymfony.Component.Templating.Loader.LoaderInterface;
const LoggerAwareInterface = Jymfony.Component.Logger.LoggerAwareInterface;
const LoggerAwareTrait = Jymfony.Component.Logger.LoggerAwareTrait;
const NullLogger = Jymfony.Component.Logger.NullLogger;

/**
 * Represents a chain loader.
 *
 * @memberOf Jymfony.Component.Templating.Loader
 */
export default class ChainLoader extends implementationOf(LoaderInterface, LoggerAwareInterface, LoggerAwareTrait) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Templating.Loader.LoaderInterface[]} [loaders=[]] An array of loader instances
     */
    __construct(loaders = []) {
        /**
         * @type {Jymfony.Component.Templating.Loader.LoaderInterface[]}
         *
         * @private
         */
        this._loaders = [];

        /**
         * @type {Jymfony.Component.Logger.LoggerInterface}
         *
         * @protected
         */
        this._logger = new NullLogger();

        for (const loader of loaders) {
            this.addLoader(loader);
        }
    }

    /**
     * Adds a loader instance.
     *
     * @param {Jymfony.Component.Templating.Loader.LoaderInterface} loader
     */
    addLoader(loader) {
        if (loader instanceof LoggerAwareInterface) {
            loader.setLogger(this._logger);
        }

        this._loaders.push(loader);
    }

    /**
     * @inheritdoc
     */
    async load(template) {
        for (const loader of this._loaders) {
            try {
                return loader.load(template);
            } catch (e) {
                // Do nothing and continue.
            }
        }

        throw new RuntimeException(__jymfony.sprintf('Cannot load template "%s"', template.name));
    }
}
