const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const ChildDefinition = Jymfony.Component.DependencyInjection.ChildDefinition;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class ResolveClassPass extends implementationOf(CompilerPassInterface) {
    /**
     * @inheritdoc
     */
    process(container) {
        for (const [ id, definition ] of __jymfony.getEntries(container.getDefinitions())) {
            if (definition.isSynthetic() || definition.getClass()) {
                continue;
            }

            if (! (definition instanceof ChildDefinition) && ReflectionClass.exists(id)) {
                definition.setClass(id);
            }
        }
    }
}
