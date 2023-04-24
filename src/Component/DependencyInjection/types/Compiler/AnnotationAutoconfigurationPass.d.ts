declare namespace Jymfony.Component.DependencyInjection.Compiler {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    export class AnnotationAutoconfigurationPass extends AbstractRecursivePass {
        process(container: ContainerBuilder): void;

        protected _processValue(value: any, isRoot?: boolean): any;
    }
}
