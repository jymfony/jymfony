declare namespace Jymfony.Component.DependencyInjection.Compiler {
    import ChildDefinition = Jymfony.Component.DependencyInjection.ChildDefinition;
    import Definition = Jymfony.Component.DependencyInjection.Definition;

    /**
     * This replaces all ChildDefinition instances with their equivalent fully
     * merged Definition instance.
     */
    export class ResolveChildDefinitionsPass extends AbstractRecursivePass {
        /**
         * @inheritdoc
         */
        protected _processValue(value: any, isRoot?: boolean): any;

        /**
         * Resolves the definition.
         *
         * @throws {RuntimeException} When the definition is invalid
         */
        private _resolveDefinition(definition: ChildDefinition): Definition;

        /**
         * @param {Jymfony.Component.DependencyInjection.ChildDefinition} definition
         *
         * @returns {Jymfony.Component.DependencyInjection.Definition}
         *
         * @private
         */
        private _doResolveDefinition(definition: ChildDefinition): Definition;
    }
}
