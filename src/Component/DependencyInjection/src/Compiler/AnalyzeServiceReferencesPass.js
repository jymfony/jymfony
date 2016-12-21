const CompilerPassInterface = Jymfony.DependencyInjection.Compiler.CompilerPassInterface;
const RepeatablePassInterface = Jymfony.DependencyInjection.Compiler.RepeatablePassInterface;
const Definition = Jymfony.DependencyInjection.Definition;
const Reference = Jymfony.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.DependencyInjection.Compiler
 * @type {Jymfony.DependencyInjection.Compiler.ResolveInvalidReferencesPass}
 */
module.exports = class AnalyzeServiceReferencesPass extends implementationOf(CompilerPassInterface, RepeatablePassInterface) {
    constructor(onlyConstructorArguments = false) {
        super();
        this._onlyConstructorArguments = onlyConstructorArguments;
    }

    /**
     * @inheritDoc
     */
    setRepeatedPass(pass) {
        this._repeatedPass = pass;
    }

    /**
     * @param {Jymfony.DependencyInjection.ContainerBuilder} container
     */
    process(container) {
        this._container = container;
        this._graph = container.getCompiler().getServiceReferenceGraph();
        this._graph.clear();

        for (let [id, definition] of __jymfony.getEntries(container.getDefinitions())) {
            if (definition.isSynthetic() || definition.isAbstract()) {
                continue;
            }

            this._currentId = id;
            this._currentDefinition = definition;
            this._processArguments(definition.getArguments());

            if (isArray(definition.getFactory())) {
                this._processArguments(definition.getFactory());
            }

            if (! this._onlyConstructorArguments) {
                this._processArguments(definition.getMethodCalls());
                this._processArguments(definition.getProperties());

                if (definition.getConfigurator()) {
                    this._processArguments([definition.getConfigurator()]);
                }
            }
        }

        for (let [id, alias] of __jymfony.getEntries(container.getAliases())) {
            this._graph.connect(id, alias, alias.toString(), this._getDefinition(alias), null);
        }
    }

    _processArguments(args) {
        for (let argument of args) {
            if (isArray(argument) || isObjectLiteral(argument)) {
                this._processArguments(argument);
            } else if (argument instanceof Reference) {
                this._graph.connect(
                    this._currentId,
                    this._currentDefinition,
                    this._getDefinitionId(argument.toString()),
                    this._getDefinition(argument.toString()),
                    argument
                );
            } else if (argument instanceof Definition) {
                this._processArguments(argument.getArguments());
                this._processArguments(argument.getMethodCalls());
                this._processArguments(argument.getProperties());

                if (isArray(argument.getFactory())) {
                    this._processArguments(argument.getFactory());
                }
            }
        }
    }

    _getDefinition(id) {
        id = this._getDefinitionId(id);

        return id === null ? null : this._container.getDefinition(id);
    }

    _getDefinitionId(id) {
        while (this._container.hasAlias(id)) {
            id = this._container.getAlias(id).toString();
        }

        if (! this._container.hasDefinition(id)) {
            return;
        }

        return id;
    }
};
