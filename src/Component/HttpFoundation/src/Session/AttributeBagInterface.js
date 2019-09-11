const SessionBagInterface = Jymfony.Component.HttpFoundation.Session.SessionBagInterface;

/**
 * Attributes store.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Session
 */
class AttributeBagInterface extends SessionBagInterface.definition {
    /**
     * Checks if an attribute is defined.
     *
     * @param {string} name The attribute name
     *
     * @returns {boolean} true if the attribute is defined, false otherwise
     */
    has(name) { }

    /**
     * Returns an attribute.
     *
     * @param {string} name The attribute name
     * @param {*} [defaultValue] The default value if not found
     *
     * @returns {*}
     */
    get(name, defaultValue = undefined) { }

    /**
     * Sets an attribute.
     *
     * @param {string} name
     * @param {*} value
     */
    set(name, value) { }

    /**
     * Returns attributes.
     *
     * @returns {Object.<string, *>} Attributes
     */
    all() { }

    /**
     * Sets attributes.
     *
     * @param {Object.<string, *>} attributes
     */
    replace(attributes) { }

    /**
     * Removes an attribute.
     *
     * @param {string} name
     *
     * @returns {*} The removed value or null when it does not exist
     */
    remove(name) { }
}

export default AttributeBagInterface;
