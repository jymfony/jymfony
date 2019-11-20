export default class KernelTestUtil {
    /**
     * Creates a Kernel.
     *
     * @param {string} [kernelClass] A fully-qualified class name of the kernel class.
     * @param {string} [environment] The environment used to create the kernel. Default to 'test' if not set.
     * @param {boolean} [debug] Whether to set debug flag or not. Default true.
     *
     * @returns {Jymfony.Component.Kernel.KernelInterface} A KernelInterface instance
     */
    static createKernel({
        kernelClass = process.env['KERNEL_CLASS'],
        environment = process.env['NODE_ENV'] || process.env['APP_ENV'],
        debug = process.env['APP_DEBUG'],
    } = {}) {
        if (undefined === kernelClass) {
            throw new LogicException('You must set the KERNEL_CLASS environment variable to the fully-qualified class name of your Kernel or pass the kernelClass option to createKernel method.');
        }

        if (! ReflectionClass.exists(kernelClass)) {
            throw new RuntimeException(__jymfony.sprintf('Class "%s" doesn\'t exist. Check that the KERNEL_CLASS env variable matches the fully-qualified class name of your Kernel or pass the correct name into the kernelClass option to createKernel method.', kernelClass));
        }

        if (undefined === environment) {
            environment = 'test';
        }

        if (undefined === debug) {
            debug = true;
        }

        return new kernelClass(environment, !! debug);
    }

    /**
     * Boots the Kernel for this test.
     *
     * @param {object} [options] The options passed to createKernel method.
     * @param {string} [options.kernelClass] A fully-qualified class name of the kernel class.
     * @param {string} [options.environment] The environment used to create the kernel. Default to 'test' if not set.
     * @param {boolean} [options.debug] Whether to set debug flag or not. Default true.
     *
     * @returns {Promise<Jymfony.Component.Kernel.KernelInterface>} A KernelInterface instance
     */
    static async bootKernel(options = {}) {
        const kernel = __self.createKernel(options);
        await kernel.boot();

        return kernel;
    }
}
