declare namespace Jymfony.Component.DependencyInjection.Compiler {
    export class CheckReferenceValidityPass extends AbstractRecursivePass {
        /**
         * @inheritdoc
         */
        protected _processValue(value: any, isRoot?: boolean): any;
    }
}
