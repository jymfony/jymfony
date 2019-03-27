declare namespace Jymfony.Component.DependencyInjection.Compiler {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    export class ReplaceAliasByActualDefinitionPass extends AbstractRecursivePass {
        private _replacements: Record<string, string>;

        __construct(): void;
        constructor();

        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;

        /**
         * @inheritdoc
         */
        protected _processValue(value: any, isRoot?: boolean): any;
    }
}
