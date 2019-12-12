declare namespace Jymfony.Component.DependencyInjection.Compiler {
    export class RemoveUnusedDefinitionsPass extends AbstractRecursivePass {
        private _connectedIds: string[];

        __construct(): void;
        constructor();

        /**
         * Processes the ContainerBuilder to remove unused definitions.
         */
        process(container: ContainerBuilder): void;

        /**
         * @inheritdoc
         */
        protected _processValue(value: any, isRoot?: boolean): any;
    }
}
