const Container = Jymfony.DependencyInjection.Container;
const BadMethodCallException = Jymfony.DependencyInjection.Exception.BadMethodCallException;
const InvalidArgumentException = Jymfony.DependencyInjection.Exception.InvalidArgumentException;
const ExtensionInterface = Jymfony.DependencyInjection.Extension.ExtensionInterface;

/**
 * Abstract extension
 *
 * @memberOf Jymfony.DependencyInjection.Extension
 */
module.exports = class Extension extends implementationOf(ExtensionInterface) {
    /**
     * @inheritDoc
     */
    getConfiguration() {
        return undefined;
    }

    /**
     * @inheritDoc
     */
    get namespace() {
        return 'http://example.org/schema/dic/'+this.alias;
    }

    /**
     * @inheritDoc
     */
    get xsdValidationBasePath() {
        return false;
    }

    /**
     * @inheritDoc
     */
    get alias() {
        let className = this.constructor.name;

        if (! /.+Extension$/.test(className)) {
            throw new BadMethodCallException('This extension does not follow the standard naming convention. You must overwrite alias getter');
        }

        return Container.underscore(className.substring(0, className.length - 9));
    }

    _processConfiguration(configuration, configs) {
        throw new Exception('Unimplemented');
    }

    /**
     * @param {ContainerBuilder} container
     * @param {*} config
     *
     * @returns {*}
     *
     * @private
     */
    _isConfigEnabled(container, config) {
        if (! config.hasOwnProperty('enabled')) {
            throw new InvalidArgumentException('The config array has no "enabled" key');
        }

        return container.parameterBag.resolveValue(config.enabled);
    }
};
