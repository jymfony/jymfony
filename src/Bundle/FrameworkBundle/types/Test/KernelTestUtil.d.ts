declare namespace Jymfony.Bundle.FrameworkBundle.Test {
    import KernelInterface = Jymfony.Component.Kernel.KernelInterface;

    interface CreateKernelOptions {
        /**
         * A fully-qualified class name of the kernel class.
         */
        kernelClass?: string;

        /**
         * The environment used to create the kernel. Default to 'test' if not set.
         */
        environment?: string;

        /**
         * Whether to set debug flag or not. Default true.
         */
        debug?: boolean;
    }

    export class KernelTestUtil {
        /**
         * Creates a Kernel.
         *
         * @returns {Jymfony.Component.Kernel.KernelInterface} A KernelInterface instance
         */
        static createKernel(opts?: CreateKernelOptions): KernelInterface;

        /**
         * Boots the Kernel for this test.
         */
        static bootKernel(options?: CreateKernelOptions): Promise<KernelInterface>;
    }
}
