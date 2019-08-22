const SessionBagInterface = Jymfony.Component.HttpFoundation.Session.SessionBagInterface;

/**
 * FlashBagInterface.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Session.Flash
 */
export default class FlashBagInterface extends SessionBagInterface.definition {
    /**
     * Adds a flash message for type.
     *
     * @param {string} type
     * @param {*} message
     */
    add(type, message) { }

    /**
     * Registers a message for a given type.
     *
     * @param {string} type
     * @param {*|*[]} message
     */
    set(type, message) { }

    /**
     * Gets flash messages for a given type.
     *
     * @param {string} type Message category type
     * @param {string[]} [defaultValue = []] Default value if type does not exist
     *
     * @returns {string[]}
     */
    peek(type, defaultValue = []) { }

    /**
     * Gets all flash messages.
     *
     * @returns {Object.<string, string[]>}
     */
    peekAll() { }

    /**
     * Gets and clears flash from the stack.
     *
     * @param {string} type
     * @param {string[]} [defaultValue = []] Default value if type does not exist
     *
     * @returns {string[]}
     */
    get(type, defaultValue = []) { }

    /**
     * Gets and clears flashes from the stack.
     *
     * @returns {Object.<string, string[]>}
     */
    all() { }

    /**
     * Sets all flash messages.
     *
     * @param {Object.<string, *[]>} messages
     */
    setAll(messages) { }

    /**
     * Has flash messages for a given type?
     *
     * @param {string} type
     *
     * @returns {boolean}
     */
    has(type) { }

    /**
     * Returns a list of all defined types.
     *
     * @returns {string[]}
     */
    keys() { }
}
