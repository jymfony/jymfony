/** @global getInterface */

/**
 * Compilation passes must implement this interface
 *
 * @memberOf Jymfony.DependencyInjection.Compiler
 * @type {Jymfony.DependencyInjection.Compiler.CompilerPassInterface}
 */
module.exports = getInterface(class CompilerPassInterface {
    /**
     * Modify container
     *
     * @function
     * @name CompilerPassInterface#process
     *
     * @param {ContainerBuilder} container
     */
});
