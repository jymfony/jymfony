declare namespace Jymfony.Component.DependencyInjection.Compiler {
    /**
     * Compiler pass to register tagged services that require a service locator.
     */
    export class RegisterServiceSubscribersPass extends AbstractRecursivePass {
        /**
         * @inheritdoc
         */
        protected _processValue(value: any, isRoot?: boolean): any;
    }
}
