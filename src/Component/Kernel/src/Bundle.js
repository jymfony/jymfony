const Container = Jymfony.Component.DependencyInjection.Container;
const ContainerAwareInterface = Jymfony.Component.DependencyInjection.ContainerAwareInterface;
const ContainerAwareTrait = Jymfony.Component.DependencyInjection.ContainerAwareTrait;
const ExtensionInterface = Jymfony.Component.DependencyInjection.Extension.ExtensionInterface;

const path = require('path');

/**
 * @memberOf Jymfony.Component.Kernel
 */
class Bundle extends implementationOf(ContainerAwareInterface, ContainerAwareTrait) {
    __construct() {
        this._namespace = undefined;
        this._name = undefined;
        this._extension = undefined;
        this._path = undefined;
    }

    /**
     * Boots the bundle
     *
     * @returns {Promise<void>}
     */
    async boot() { }

    /**
     * Shutdowns the Bundle.
     *
     * @returns {Promise<void>}
     */
    async shutdown() { }

    /**
     * Builds the bundle
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    build(container) { } // eslint-disable-line no-unused-vars

    /**
     * Gets the Bundle directory path.
     *
     * The path should always be returned as a Unix path (with /).
     *
     * @returns {string} The Bundle absolute path
     */
    get path() {
        if (undefined === this._path) {
            const reflClass = new ReflectionClass(this);

            /**
             * @type {string}
             * @private
             */
            this._path = path.dirname(reflClass.filename);
        }

        return this._path;
    }

    /**
     * @returns {string}
     */
    getName() {
        if (! this._name) {
            this._parseClassName();
        }

        return this._name;
    }

    /**
     * @returns {string}
     */
    getNamespace() {
        if (! this._namespace) {
            this._parseClassName();
        }

        return this._namespace;
    }

    /**
     * @returns {Jymfony.Component.Kernel.Bundle|undefined}
     */
    getParent() {
        return undefined;
    }

    /**
     * @returns {string|undefined}
     */
    getContainerExtension() {
        if (undefined === this._extension) {
            const extension = this._createContainerExtension();
            if (extension) {
                if (! (extension instanceof ExtensionInterface)) {
                    const r = new ReflectionClass(extension);
                    throw new LogicException(`Extension ${r.name} must implement Jymfony.Component.DependencyInjection.Extension.ExtensionInterface`);
                }

                // Check naming convention
                const basename = this.getName().replace(/Bundle$/, '');
                const expectedAlias = Container.underscore(basename);

                if (expectedAlias !== extension.alias) {
                    throw new LogicException(
                        `Users will expect the alias of the default extension of a bundle to be the underscored version of the bundle name ("${expectedAlias}"). ` +
                        `You can override "Bundle::getContainerExtension()" if you want to use "${extension.alias}" or another alias.`
                    );
                }

                this._extension = extension;
            } else {
                this._extension = undefined;
            }
        }

        if (this._extension) {
            return this._extension;
        }
    }

    /**
     * @returns {Jymfony.Component.DependencyInjection.Extension.ExtensionInterface}
     *
     * @private
     */
    _createContainerExtension() {
        const className = this._getContainerExtensionClass();
        if (ReflectionClass.exists(className)) {
            const r = new ReflectionClass(className);
            return r.newInstance();
        }
    }

    /**
     * @returns {string}
     *
     * @private
     */
    _getContainerExtensionClass() {
        const basename = this.getName().replace(/Bundle$/, '');
        return this.getNamespace() + '.DependencyInjection.' + basename + 'Extension';
    }

    /**
     * @private
     */
    _parseClassName() {
        const refl = new ReflectionClass(this);

        this._namespace = refl.namespaceName;

        const position = refl.name.lastIndexOf('.');
        this._name = refl.name.substring(position + 1);
    }
}

module.exports = Bundle;
