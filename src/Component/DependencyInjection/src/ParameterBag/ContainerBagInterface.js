const ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.ParameterBag
 */
class ContainerBagInterface extends ContainerInterface.definition {
    /**
     * Gets the service container parameters.
     *
     * @returns {Array} An array of parameters
     */
    all() { }

    /**
     * Replaces parameter placeholders (%name%) by their values.
     *
     * @param {*} value A value
     *
     * @throws {Jymfony.Component.DependencyInjection.Exception.ParameterNotFoundException} if a placeholder references a parameter that does not exist
     */
    resolveValue(value) { }

    /**
     * Escape parameter placeholders %.
     *
     * @param {*} value
     *
     * @returns {*}
     */
    escapeValue(value) { }

    /**
     * Unescape parameter placeholders %.
     *
     * @param {*} value
     *
     * @returns {*}
     */
    unescapeValue(value) { }
}

module.exports = getInterface(ContainerBagInterface);
