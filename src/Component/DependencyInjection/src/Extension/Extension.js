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
        let reflClass = new ReflectionClass(this);

        let nsName = reflClass.namespaceName();
        let confClass = nsName + '.Configuration';

        if (ReflectionClass.exists(confClass)) {
            let reflected = new ReflectionCalss(confClass);
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
