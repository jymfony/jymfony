const ArgumentInterface = Jymfony.Component.DependencyInjection.Argument.ArgumentInterface;
const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const Container = Jymfony.Component.DependencyInjection.Container;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class AnalyzeServiceReferencesPass extends AbstractRecursivePass {
    /**
     * Constructor.
     *
     * @param {boolean} [onlyConstructorArguments = false]
     */
    __construct(onlyConstructorArguments = false) {
        super.__construct();

        /**
         * @type {boolean}
         *
         * @private
         */
        this._onlyConstructorArguments = onlyConstructorArguments;

        /**
         * @type {Jymfony.Component.DependencyInjection.ContainerBuilder}
         *
         * @protected
         */
        this._container = undefined;

        /**
         * @type {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraph}
         *
         * @private
         */
        this._graph = undefined;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._lazy = false;

        /**
         * @type {Jymfony.Component.DependencyInjection.Definition}
         *
         * @protected
         */
        this._currentDefinition = undefined;
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    process(container) {
        this._container = container;
        this._graph = container.getCompiler().getServiceReferenceGraph();
        this._graph.clear();
        this._lazy = false;

        for (const [ id, alias ] of __jymfony.getEntries(container.getAliases())) {
            const targetId = this._getDefinitionId(alias.toString());
            this._graph.connect(id, alias, alias.toString(), this._getDefinition(targetId), null);
        }

        super.process(container);
    }

    /**
     * @param {*} value
     * @param {boolean} [isRoot = false]
     *
     * @returns {*}
     *
     * @protected
     */
    _processValue(value, isRoot = false) {
        const lazy = this._lazy;

        if (value instanceof ArgumentInterface) {
            this._lazy = true;
            super._processValue(value.values);
            this._lazy = lazy;

            return value;
        }

        if (value instanceof Reference) {
            const targetId = this._getDefinitionId(value.toString());
            const targetDefinition = this._getDefinition(targetId);

            this._graph.connect(
                this._currentId,
                this._currentDefinition,
                targetId,
                targetDefinition,
                value,
                this._lazy,
                Container.IGNORE_ON_UNINITIALIZED_REFERENCE === value.invalidBehavior
            );

            return value;
        }

        if (! (value instanceof Definition)) {
            return super._processValue(value, isRoot);
        }

        if (isRoot) {
            if (value.isSynthetic() || value.isAbstract()) {
                return value;
            }

            this._currentDefinition = value;
        } else if (this._currentDefinition === value) {
            return value;
        }

        this._lazy = false;
        this._processValue(value.getFactory());
        this._processValue(value.getArguments());

        if (! this._onlyConstructorArguments) {
            this._processValue(value.getProperties());
            this._processValue(value.getMethodCalls());
            this._processValue(value.getShutdownCalls());
            this._processValue(value.getConfigurator());
        }

        this._lazy = lazy;

        return value;
    }

    /**
     * @param {string|undefined} id
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition|undefined}
     *
     * @private
     */
    _getDefinition(id) {
        return ! id ? undefined : (this._container.hasDefinition(id) ? this._container.getDefinition(id) : undefined);
    }

    /**
     * @param {string} id
     *
     * @returns {string}
     *
     * @private
     */
    _getDefinitionId(id) {
        while (this._container.hasAlias(id)) {
            id = this._container.getAlias(id).toString();
        }

        if (! this._container.hasDefinition(id)) {
            return undefined;
        }

        return id;
    }
}
