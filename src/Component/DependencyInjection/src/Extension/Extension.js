const Processor = Jymfony.Component.Config.Definition.Processor;
const Container = Jymfony.Component.DependencyInjection.Container;
const BadMethodCallException = Jymfony.Component.DependencyInjection.Exception.BadMethodCallException;
const InvalidArgumentException = Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException;
const ExtensionInterface = Jymfony.Component.DependencyInjection.Extension.ExtensionInterface;

/**
 * Abstract extension.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Extension
 */
class Extension extends implementationOf(ExtensionInterface) {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {Object[]}
         *
         * @private
         */
        this._processedConfigs = [];
    }

    /**
     * @inheritdoc
     */
    getConfiguration() {
        const reflClass = new ReflectionClass(this);

        const nsName = reflClass.namespaceName;
        const confClass = nsName + '.Configuration';

        if (ReflectionClass.exists(confClass)) {
            const reflected = new ReflectionClass(confClass);
            return reflected.newInstance();
        }

        return undefined;
    }

    /**
     * @inheritdoc
     */
    get namespace() {
        return 'http://example.org/schema/dic/' + this.alias;
    }

    /**
     * @inheritdoc
     */
    get xsdValidationBasePath() {
        return false;
    }

    /**
     * @inheritdoc
     */
    get alias() {
        const className = this.constructor.name;

        if (! /.+Extension$/.test(className)) {
            throw new BadMethodCallException('This extension does not follow the standard naming convention. You must overwrite alias getter');
        }

        return Container.underscore(className.substring(0, className.length - 9));
    }

    /**
     * @todo
     *
     * @param {Jymfony.Component.Config.Definition.ConfigurationInterface} configuration
     * @param {Object[]} configs
     *
     * @returns {Object[]}
     */
    _processConfiguration(configuration, configs) {
        const processor = new Processor();
        const processed = processor.processConfiguration(configuration, configs);
        this._processedConfigs.push(processed);

        return processed;
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {Object} config
     *
     * @returns {*}
     *
     * @protected
     */
    _isConfigEnabled(container, config) {
        if (! config.hasOwnProperty('enabled')) {
            throw new InvalidArgumentException('The config array has no "enabled" key');
        }

        return container.parameterBag.resolveValue(config.enabled);
    }
}

module.exports = Extension;
