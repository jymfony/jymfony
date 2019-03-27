declare namespace Jymfony.Component.DependencyInjection.Compiler {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
    import ParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag;

    export class ResolveParameterPlaceHoldersPass extends AbstractRecursivePass {
        private _bag?: ParameterBag;

        __construct(): void;
        constructor();

        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;

        /**
         * @inheritdoc
         */
        _processValue(value: any, isRoot?: boolean): any;
    }
}
