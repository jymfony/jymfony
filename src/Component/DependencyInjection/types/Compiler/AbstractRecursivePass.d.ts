declare namespace Jymfony.Component.DependencyInjection.Compiler {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
    import Definition = Jymfony.Component.DependencyInjection.Definition;

    export abstract class AbstractRecursivePass extends implementationOf(CompilerPassInterface) {
        /**
         * @type {string}
         *
         * @protected
         */
        protected _currentId?: string;

        /**
         * @type {Jymfony.Component.DependencyInjection.ContainerBuilder}
         *
         * @protected
         */
        protected _container?: ContainerBuilder;

        __construct(): void;
        constructor();

        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;

        /**
         * Processes a value found in a definition tree.
         *
         * @returns The processed value
         */
        protected _processValue(value: any, isRoot?: boolean): any;

        /**
         * @throws {RuntimeException}
         */
        protected _getConstructor(definition: Definition, required: boolean): ReflectionMethod | null;

        /**
         * @throws {RuntimeException}
         */
        protected _getReflectionMethod(definition: Definition, method: string | symbol): ReflectionMethod;
    }
}
