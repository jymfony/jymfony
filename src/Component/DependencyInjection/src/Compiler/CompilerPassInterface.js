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
     * @function
     * @name CompilerPassInterface#process
     *
     * @param {ContainerBuilder} container
     */
}

module.exports = getInterface(CompilerPassInterface);
