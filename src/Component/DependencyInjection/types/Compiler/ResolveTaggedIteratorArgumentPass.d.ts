declare namespace Jymfony.Component.DependencyInjection.Compiler {
    /**
     * Resolves all TaggedIteratorArgument arguments.
     */
    export class ResolveTaggedIteratorArgumentPass extends mix(AbstractRecursivePass, PriorityTaggedServiceTrait) {
        /**
         * @inheritdoc
         */
        _processValue(value: any, isRoot?: boolean): any;
    }
}
