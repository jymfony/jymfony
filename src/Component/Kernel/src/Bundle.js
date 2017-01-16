const Container = Jymfony.DependencyInjection.Container;
const ContainerAwareTrait = Jymfony.DependencyInjection.ContainerAwareTrait;
const ExtensionInterface = Jymfony.DependencyInjection.Extension.ExtensionInterface;

/**
 * @memberOf Jymfony.Kernel
 */
module.exports = class Bundle extends implementationOf(ContainerAwareTrait) {
    /**
     * Boots the bundle
     */
    boot() {
    }

    /**
     * Builds the bundle
     *
     * @param {Jymfony.DependencyInjection.ContainerBuilder} container
     */
    build(container) {
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
                    throw new LogicException(`Extension ${r.name} must implement Jymfony.DependencyInjection.Extension.ExtensionInterface`);
                }

                // Check naming convention
                let basename = this.getName().replace(/Bundle$/, '');
                let expectedAlias = Container.underscore(basename);

                if (expectedAlias != extension.getAlias()) {
                    throw new LogicException(
                        `Users will expect the alias of the default extension of a bundle to be the underscored version of the bundle name ("${expectedAlias}"). ` +
                        `You can override "Bundle::getContainerExtension()" if you want to use "${extension.getAlias()}" or another alias.`
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
};
