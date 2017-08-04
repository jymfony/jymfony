/**
 * Compilation passes must implement this interface
 *
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class CompilerPassInterface {
    /**
     * Modify container
     *
     * @param {ContainerBuilder} container
     */
    process(container) { }
}

module.exports = getInterface(CompilerPassInterface);
