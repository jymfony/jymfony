const RepeatablePassInterface = Jymfony.Component.DependencyInjection.Compiler.RepeatablePassInterface;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class AnalyzeServiceReferencesPass extends implementationOf(RepeatablePassInterface) {
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
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    process(container) {
        this._container = container;
        this._graph = container.getCompiler().getServiceReferenceGraph();
        this._graph.clear();

        for (let [ id, definition ] of __jymfony.getEntries(container.getDefinitions())) {
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
                    this._processArguments([ definition.getConfigurator() ]);
                }
            }
        }

        for (let [ id, alias ] of __jymfony.getEntries(container.getAliases())) {
            this._graph.connect(id, alias, alias.toString(), this._getDefinition(alias), null);
        }
    }

    _processArguments(args) {
        for (let argument of Object.values(args)) {
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
