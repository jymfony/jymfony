const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const Container = Jymfony.Component.DependencyInjection.Container;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const ServiceNotFoundException = Jymfony.Component.DependencyInjection.Exception.ServiceNotFoundException;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 * @type {Jymfony.Component.DependencyInjection.Compiler.CheckExceptionOnInvalidReferenceBehaviorPass}
 */
module.exports = class CheckExceptionOnInvalidReferenceBehaviorPass extends implementationOf(CompilerPassInterface) {
    process(container) {
        this._container = container;

        for (let [ id, definition ] of __jymfony.getEntries(container.getDefinitions())) {
            this._sourceId = id;
            this._processDefinition(definition);
        }
    }

    _processDefinition(definition) {
        this._processReferences(definition.getArguments());
        this._processReferences(definition.getMethodCalls());
        this._processReferences(definition.getProperties());
    }

    _processReferences(args) {
        for (let argument of Object.values(args)) {
            if (isArray(argument) || isObjectLiteral(argument)) {
                this._processReferences(argument);
            } else if (argument instanceof Definition) {
                this._processDefinition(argument);
            } else if (argument instanceof Reference && Container.EXCEPTION_ON_INVALID_REFERENCE === argument.invalidBehavior) {
                let destId = argument.toString();

                if (! this._container.has(destId)) {
                    throw new ServiceNotFoundException(destId, this._sourceId);
                }
            }
        }
    }
};
