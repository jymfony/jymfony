declare namespace Jymfony.Bundle.FrameworkBundle {
    import ContainerInterface = Jymfony.Contracts.DependencyInjection.ContainerInterface;
    import Bundle = Jymfony.Component.Kernel.Bundle;

    /**
     * FrameworkBundle.
     */
    export class FrameworkBundle extends Bundle {
        /**
         * @inheritDoc
         */
        boot(): Promise<void>;

        /**
         * @inheritdoc
         */
        build(container: ContainerInterface): void;

        /**
         * Adds a compiler pass if class exists.
         */
        private _addCompilerPassIfExists(container: ContainerInterface, pass: string, type?: string, priority?: number): void;
    }
}
