/**
 * Compilation passes must implement this interface.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class CompilerPassInterface {
    /**
     * Modify container.
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    process(container) { }
}

export default getInterface(CompilerPassInterface);
