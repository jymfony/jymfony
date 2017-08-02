/**
 * @memberOf Jymfony.Component.Kernel
 *
 * @interface
 */
class KernelInterface {
    /**
     * Gets the name of the kernel.
     *
     * @returns {string} The kernel name
     */
    getName() { }

    /**
     * Gets the environment.
     *
     * @returns {string} The current environment
     */
    get environment() { }

    /**
     * Checks if debug mode is enabled.
     *
     * @returns {boolean} true if debug mode is enabled, false otherwise
     */
    get debug() { }

    /**
     * Gets the current container.
     *
     * @returns {Jymfony.Component.DependencyInjection.Container} A ContainerInterface instance
     */
    get container() { };
}

module.exports = getInterface(KernelInterface);
