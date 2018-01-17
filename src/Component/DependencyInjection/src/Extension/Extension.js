const Container = Jymfony.Component.DependencyInjection.Container;
const BadMethodCallException = Jymfony.Component.DependencyInjection.Exception.BadMethodCallException;
const InvalidArgumentException = Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException;
const ExtensionInterface = Jymfony.Component.DependencyInjection.Extension.ExtensionInterface;

/**
 * Abstract extension
 *
 * @memberOf Jymfony.Component.DependencyInjection.Extension
 */
class Extension extends implementationOf(ExtensionInterface) {
    /**
     * @inheritDoc
     */
    getConfiguration() {
        const reflClass = new ReflectionClass(this);

        const nsName = reflClass.namespaceName();
        const confClass = nsName + '.Configuration';

        if (ReflectionClass.exists(confClass)) {
            const reflected = new ReflectionClass(confClass);
            return reflected.newInstance();
        }

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
        const className = this.constructor.name;

        if (! /.+Extension$/.test(className)) {
            throw new BadMethodCallException('This extension does not follow the standard naming convention. You must overwrite alias getter');
        }

        return Container.underscore(className.substring(0, className.length - 9));
    }

    /**
     * @todo
     */
    _processConfiguration(configuration, configs) { // eslint-disable-line no-unused-vars
        throw new Exception('Unimplemented');
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
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
}

module.exports = Extension;
