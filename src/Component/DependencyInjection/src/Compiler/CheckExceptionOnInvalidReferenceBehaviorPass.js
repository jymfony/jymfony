const CompilerPassInterface = Jymfony.DependencyInjection.Compiler.CompilerPassInterface;
const Container = Jymfony.DependencyInjection.Container;
const Definition = Jymfony.DependencyInjection.Definition;
const ServiceNotFoundException = Jymfony.DependencyInjection.Exception.ServiceNotFoundException;
const Reference = Jymfony.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.DependencyInjection.Compiler
 * @type {Jymfony.DependencyInjection.Compiler.CheckExceptionOnInvalidReferenceBehaviorPass}
 */
module.exports = class CheckExceptionOnInvalidReferenceBehaviorPass extends implementationOf(CompilerPassInterface) {
    process(container) {
        this._container = container;

        for (let [id, definition] of __jymfony.getEntries(container.getDefinitions())) {
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
        for (let argument of args) {
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
