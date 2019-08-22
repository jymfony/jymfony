const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;

/**
 * A pass that might be run repeatedly.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class RepeatablePassInterface extends CompilerPassInterface.definition {
    /**
     * Sets the RepeatedPass interface.
     *
     * @param {Jymfony.Component.DependencyInjection.Compiler.RepeatedPass} container
     */
    setRepeatedPass(container) { }
}

export default getInterface(RepeatablePassInterface);
