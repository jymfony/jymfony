/**
 * @memberOf Jymfony.Component.Console.Helper
 *
 * @interface
 */
class HelperInterface {
    /**
     * Sets the helper set associated with this helper.
     *
     * @param {Jymfony.Component.Console.Helper.HelperSet} helperSet A HelperSet instance
     */
    set helperSet(helperSet) { }

    /**
     * Gets the helper set associated with this helper.
     *
     * @returns {Jymfony.Component.Console.Helper.HelperSet} A HelperSet instance
     */
    get helperSet() { }

    /**
     * Returns the canonical name of this helper.
     *
     * @returns {string} The canonical name
     */
    get name() { }
}

module.exports = getInterface(HelperInterface);
