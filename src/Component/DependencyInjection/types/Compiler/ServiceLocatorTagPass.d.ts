declare namespace Jymfony.Component.DependencyInjection.Compiler {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    export class ServiceLocatorTagPass extends AbstractRecursivePass {
        /**
         * @inheritdoc
         */
        _processValue(value: any, isRoot?: boolean): any;

        static register(container: ContainerBuilder, refMap: Record<string, Reference>, callerId: string): Reference;
    }
}
