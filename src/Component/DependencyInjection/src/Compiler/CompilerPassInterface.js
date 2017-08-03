/**
 * Compilation passes must implement this interface
 *
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 * @type {Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface}
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
