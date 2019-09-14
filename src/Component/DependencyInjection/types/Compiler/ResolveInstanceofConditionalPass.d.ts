declare namespace Jymfony.Component.DependencyInjection.Compiler {
    /**
     * Applies instanceof conditionals to definitions.
     */
    export class ResolveInstanceofConditionalsPass extends implementationOf(CompilerPassInterface) {
        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;

        private _processDefinition(container: ContainerBuilder, id: string, definition: Definition): Definition;
        private _mergeConditionals(instanceofConditionals: Record<string, Definition>, container: ContainerBuilder): Record<string, Definition[]>;
    }
}
