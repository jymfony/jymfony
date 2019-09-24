declare namespace Jymfony.Component.DependencyInjection.Compiler {
    /**
     * Throws an exception for any Definitions that have errors and still exist.
     */
    export class DefinitionErrorExceptionPass extends AbstractRecursivePass {
        /**
         * @inheritdoc
         */
        protected _processValue(value: any, isRoot?: boolean): any;
    }
}
