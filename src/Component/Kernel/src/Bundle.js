const Container = Jymfony.Component.DependencyInjection.Container;
const ContainerAwareInterface = Jymfony.Component.DependencyInjection.ContainerAwareInterface;
const ContainerAwareTrait = Jymfony.Component.DependencyInjection.ContainerAwareTrait;
const ExtensionInterface = Jymfony.Component.DependencyInjection.Extension.ExtensionInterface;

const path = require('path');

/**
 * @memberOf Jymfony.Component.Kernel
 */
class Bundle extends implementationOf(ContainerAwareInterface, ContainerAwareTrait) {
    /**
     * Boots the bundle
     */
    boot() {
    }

    /**
     * Shutdowns the Bundle.
     */
    shutdown() {
    }

    /**
     * Builds the bundle
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    build(container) {
    }

    /**
     * Gets the Bundle directory path.
     *
     * The path should always be returned as a Unix path (with /).
     *
     * @returns {string} The Bundle absolute path
     */
    get path() {
        if (undefined === this._path) {
            let reflClass = new ReflectionClass(this);

            /**
             * @type {string}
             * @private
             */
            this._path = path.dirname(reflClass.filename);
        }

        return this._path;
    }

    getName() {
        if (! this._name) {
            this._parseClassName();
        }

        return this._name;
    }

    getNamespace() {
        if (! this._namespace) {
            this._parseClassName();
        }

        return this._namespace;
    }

    getParent() {
        return undefined;
    }

    getContainerExtension() {
        if (undefined === this._extension) {
            let extension = this._createContainerExtension();
            if (extension) {
                if (! (extension instanceof ExtensionInterface)) {
                    let r = new ReflectionClass(extension);
                    throw new LogicException(`Extension ${r.name} must implement Jymfony.Component.DependencyInjection.Extension.ExtensionInterface`);
                }

                // Check naming convention
                let basename = this.getName().replace(/Bundle$/, '');
                let expectedAlias = Container.underscore(basename);

                if (expectedAlias !== extension.alias) {
                    throw new LogicException(
                        `Users will expect the alias of the default extension of a bundle to be the underscored version of the bundle name ("${expectedAlias}"). ` +
                        `You can override "Bundle::getContainerExtension()" if you want to use "${extension.alias}" or another alias.`
                    );
                }

                this._extension = extension;
            } else {
                this._extension = null;
            }
        }

        if (this._extension) {
            return this._extension;
        }
    }

    _createContainerExtension() {
        let className = this._getContainerExtensionClass();
        if (ReflectionClass.exists(className)) {
            let r = new ReflectionClass(className);
            return r.newInstance();
        }
    }

    _getContainerExtensionClass() {
        let basename = this.getName().replace(/Bundle$/, '');
        return this.getNamespace() + '.DependencyInjection.' + basename + 'Extension';
    }

    _parseClassName() {
        let refl = new ReflectionClass(this);

        this._namespace = refl.namespaceName;

        let position = refl.name.lastIndexOf('.');
        this._name = refl.name.substring(position + 1);
    }
}

module.exports = Bundle;
