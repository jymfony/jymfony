const CompilerPassInterface = Jymfony.DependencyInjection.Compiler.CompilerPassInterface;
const RepeatablePassInterface = Jymfony.DependencyInjection.Compiler.RepeatablePassInterface;
const Definition = Jymfony.DependencyInjection.Definition;
const Reference = Jymfony.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.DependencyInjection.Compiler
 * @type {Jymfony.DependencyInjection.Compiler.RemoveAbstractDefinitionsPass}
 */
module.exports = class InlineServiceDefinitionsPass extends implementationOf(CompilerPassInterface, RepeatablePassInterface) {
    process(container) {
        this._compiler = container.getCompiler();
        this._formatter = container.getCompiler().logFormatter;
        this._graph = container.getCompiler().getServiceReferenceGraph();

        container.setDefinitions(this._inlineArguments(container, container.getDefinitions(), true));
    }

    /**
     * @inheritDoc
     */
    setRepeatedPass(pass) {
        // do nothing - unused
    }

    _inlineArguments(container, definitions, isRoot = false) {
        for (let [k, argument] of __jymfony.getEntries(arguments)) {
            if (isRoot) {
                this._currentId = k;
            }

            if (isArray(argument) || isObjectLiteral(argument)) {
                arguments[k] = this._inlineArguments(container, argument);
            } else if (argument instanceof Reference) {
                let id = argument.toString();
                if (! container.hasDefinition(id)) {
                    continue;
                }

                let definition = container.getDefinition(id);
                if (this._isInlineableDefinition(id, definition)) {
                    this._compiler.addLogMessage(this._formatter.formatInlineService(this, id, this._currentId));

                    if (definition.isShared()) {
                        arguments[k] = definition;
                    } else {
                        arguments[k] = { ...definition };
                    }
                }
            } else if (argument instanceof Definition) {
                argument.setArguments(this._inlineArguments(container, argument.getArguments()));
                argument.setMethodCalls(this._inlineArguments(container, argument.getMethodCalls()));
                argument.setProperties(this._inlineArguments(container, argument.getProperties()));

                let configurator = this._inlineArguments(container, [argument.getConfigurator()]);
                argument.setConfigurator(configurator[0]);

                let factory = this._inlineArguments(container, [argument.getFactory()]);
                argument.setFactory(factory[0]);
            }
        }

        return arguments;
    }

    _isInlineableDefinition(id, definition) {
        if (! definition.isShared()) {
            return true;
        }

        if (definition.isPublic() || definition.isLazy()) {
            return false;
        }

        if (! this._graph.hasNode(id)) {
            return true;
        }

        if (this._currentId == id) {
            return false;
        }

        let ids = [];
        for (let edge of this._graph.getNode(id).getInEdges()) {
            ids.push(edge.getSourceNode().getId());
        }

        if ([ ...new Set(ids) ].length > 1) {
            return false;
        }

        let factory;
        if (ids.length > 1 && isArray(factory = definition.getFactory()) && (factory[0] instanceof Reference || factory[0] instanceof Definition)) {
            return false;
        }

        return true;
    }
};
