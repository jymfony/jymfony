declare namespace Jymfony.Bundle.FrameworkBundle.Console {
    import BaseApplication = Jymfony.Component.Console.Application;
    import KernelInterface = Jymfony.Component.Kernel.KernelInterface;

    export class Application extends BaseApplication {
        private _kernel: KernelInterface;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(kernel: KernelInterface): void;
        constructor(kernel: KernelInterface);

        /**
         * Gets the Kernel associated with this Console.
         */
        public readonly kernel: KernelInterface;

        /**
         * @inheritdoc
         */
        shutdown(exitCode: number): Promise<void>;

        /**
         * @inheritdoc
         */
        getLongVersion(): string;
    }
}
