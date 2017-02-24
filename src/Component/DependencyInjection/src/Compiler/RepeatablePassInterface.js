const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;

/**
 * A pass that might be run repeatedly
 *
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class RepeatablePassInterface extends CompilerPassInterface.definition {
    /**
     * Sets the RepeatedPass interface
     *
     * @function
     * @name RepeatablePassInterface#setRepeatedPass
     *
     * @param {Jymfony.Component.DependencyInjection.Compiler.RepeatedPass} container
     */
}

module.exports = getInterface(RepeatablePassInterface);
