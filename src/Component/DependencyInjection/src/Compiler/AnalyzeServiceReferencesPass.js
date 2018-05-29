const ArgumentInterface = Jymfony.Component.DependencyInjection.Argument.ArgumentInterface;
const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const RepeatablePassInterface = Jymfony.Component.DependencyInjection.Compiler.RepeatablePassInterface;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class AnalyzeServiceReferencesPass extends mix(AbstractRecursivePass, RepeatablePassInterface) {
    __construct(onlyConstructorArguments = false) {
        this._onlyConstructorArguments = onlyConstructorArguments;
    }

    /**
     * @inheritDoc
     */
    setRepeatedPass(pass) {
        this._repeatedPass = pass;
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    process(container) {
        /**
         * @type {Jymfony.Component.DependencyInjection.ContainerBuilder}
         * @protected
         */
        this._container = container;

        /**
         * @type {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraph}
         * @private
         */
        this._graph = container.getCompiler().getServiceReferenceGraph();
        this._graph.clear();
        this._lazy = false;

        for (const [ id, alias ] of __jymfony.getEntries(container.getAliases())) {
            this._graph.connect(id, alias, alias.toString(), this._getDefinition(alias), null);
        }

        super.process(container);
    }

    _processValue(value, isRoot = false) {
        const lazy = this._lazy;

        if (value instanceof ArgumentInterface) {
            this._lazy = true;
            super._processValue(value.values);
            this._lazy = lazy;

            return value;
        }

        if (value instanceof Reference) {
            const targetDefinition = this._getDefinition(value.toString());

            this._graph.connect(
                this._currentId,
                this._currentDefinition,
                this._getDefinitionId(value.toString()),
                targetDefinition,
                value
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
        }

        this._lazy = false;

        this._processValue(value.getFactory());
        this._processValue(value.getArguments());

        if (! this._onlyConstructorArguments) {
            this._processValue(value.getProperties());
            this._processValue(value.getMethodCalls());
            this._processValue(value.getConfigurator());
        }

        this._lazy = lazy;

        return value;
    }

    _getDefinition(id) {
        return undefined === id ? undefined : this._container.getDefinition(id);
    }

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

module.exports = AnalyzeServiceReferencesPass;
