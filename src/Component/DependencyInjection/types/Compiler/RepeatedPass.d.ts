declare namespace Jymfony.Component.DependencyInjection.Compiler {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    export class RepeatedPass extends implementationOf(CompilerPassInterface) {
        private _passes: RepeatablePassInterface[];
        private _repeat?: boolean;

        __construct(passes: RepeatablePassInterface[]): void;
        constructor(passes: RepeatablePassInterface[]);

        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;

        /**
         * Sets if the pass should repeat.
         */
        setRepeat(): void;

        /**
         * Returns the passes.
         */
        getPasses(): RepeatablePassInterface[];
    }
}
