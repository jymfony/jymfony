const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const RuntimeException = Jymfony.Component.DependencyInjection.Exception.RuntimeException;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class CheckReferenceValidityPass extends AbstractRecursivePass {
    _processValue(value, isRoot = false) {
        if (isRoot && value instanceof Definition && (value.isSynthetic() || value.isAbstract())) {
            return value;
        }

        if (value instanceof Reference && this._container.hasDefinition(value.toString())) {
            let targetDefinition = this._container.getDefinition(value.toString());

            if (targetDefinition.isAbstract()) {
                throw new RuntimeException(
                    `The definition "${this._currentId}" has a reference to an abstract definition "${value.toString()}". `
                    + 'Abstract definitions cannot be the target of references.'
                );
            }
        }

        return super._processValue(value, isRoot);
    }
}

module.exports = CheckReferenceValidityPass;
