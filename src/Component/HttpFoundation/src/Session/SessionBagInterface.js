/**
 * Session Bag store.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Session
 */
class SessionBagInterface {
    /**
     * Gets this bag's name.
     *
     * @returns {string}
     */
    get name() { }

    /**
     * Initializes the Bag.
     *
     * @param {Object.<string, *>} attributes
     */
    initialize(attributes) { }

    /**
     * Gets the storage key for this bag.
     *
     * @returns {string}
     */
    get storageKey() { }

    /**
     * Clears out data from bag.
     *
     * @returns {Object.<string, *>} Whatever data was contained
     */
    clear() { }
}

export default getInterface(SessionBagInterface);
