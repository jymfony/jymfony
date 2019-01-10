const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const Container = Jymfony.Component.DependencyInjection.Container;
const ServiceNotFoundException = Jymfony.Component.DependencyInjection.Exception.ServiceNotFoundException;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class CheckExceptionOnInvalidReferenceBehaviorPass extends AbstractRecursivePass {
    /**
     * @inheritdoc
     */
    _processValue(value, isRoot = false) {
        if (value instanceof Reference && Container.EXCEPTION_ON_INVALID_REFERENCE === value.invalidBehavior) {
            const destId = value.toString();

            if (! this._container.has(destId)) {
                throw new ServiceNotFoundException(destId, this._currentId);
            }
        }

        return super._processValue(value, isRoot);
    }
}

module.exports = CheckExceptionOnInvalidReferenceBehaviorPass;
