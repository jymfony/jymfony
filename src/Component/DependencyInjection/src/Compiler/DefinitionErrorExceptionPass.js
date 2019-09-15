const Container = Jymfony.Component.DependencyInjection.Container;
const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const RuntimeException = Jymfony.Component.DependencyInjection.Exception.RuntimeException;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * Throws an exception for any Definitions that have errors and still exist.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class DefinitionErrorExceptionPass extends AbstractRecursivePass {
    /**
     * @inheritdoc
     */
    _processValue(value, isRoot = false) {
        if (! (value instanceof Definition) || ! value.hasErrors()) {
            return super._processValue(value, isRoot);
        }

        if (isRoot && ! value.isPublic()) {
            const graph = this._container.getCompiler().getServiceReferenceGraph();
            let runtimeException = false;
            for (const edge of graph.getNode(this._currentId).getInEdges()) {
                if (! (edge.getValue() instanceof Reference) || Container.EXCEPTION_ON_INVALID_REFERENCE !== edge.getValue().invalidBehavior) {
                    runtimeException = false;
                    break;
                }

                runtimeException = true;
            }
            if (runtimeException) {
                return super._processValue(value, isRoot);
            }
        }

        // Only show the first error so the user can focus on it
        throw new RuntimeException(value.getErrors()[0]);
    }
}
