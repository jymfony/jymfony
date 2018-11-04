/**
 * StorageInterface.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Session.Storage
 */
class SessionStorageInterface {
    /**
     * Starts the session.
     *
     * @returns {Promise<void>}
     *
     * @throws {RuntimeException} if something goes wrong starting the session
     */
    async start() { }

    /**
     * Checks if the session is started.
     *
     * @returns {boolean} True if started, false otherwise
     */
    get started() { }

    /**
     * Returns the session ID.
     *
     * @returns {string} The session ID or empty
     */
    get id() { }

    /**
     * Sets the session ID.
     *
     * @param {string} id
     */
    set id(id) { }

    /**
     * Returns the session name.
     *
     * @returns {*} The session name
     */
    get name() { }

    /**
     * Sets the session name.
     *
     * @param {string} name
     */
    set name(name) { }

    /**
     * Regenerates id that represents this storage.
     *
     * Note regenerate+destroy should not clear the session data in memory
     * only delete the session data from persistent storage.
     *
     * @param {boolean} [destroy = false] Destroy session when regenerating?
     * @param {int} [lifetime = 0] Sets the cookie lifetime for the session cookie. 0 sets the cookie
     *                             to expire with browser session. Time is in seconds, and is
     *                             not a Unix timestamp.
     *
     * @returns {Promise<boolean>} True if session regenerated, false if error
     *
     * @throws {RuntimeException} If an error occurs while regenerating this storage
     */
    async regenerate(destroy = false, lifetime = 0) { }

    /**
     * Force the session to be saved and closed.
     *
     * @returns {Promise<void>}
     *
     * @throws {RuntimeException} if the session is saved without being started, or if the session
     *                            is already closed
     */
    async save() { }

    /**
     * Clear all session data in memory.
     *
     * @returns {Promise<void>}
     */
    async clear() { }

    /**
     * Gets a SessionBagInterface by name.
     *
     * @param {string} name
     *
     * @returns {Jymfony.Component.HttpFoundation.Session.SessionBagInterface}
     *
     * @throws {InvalidArgumentException} If the bag does not exist
     */
    getBag(name) { }

    /**
     * Registers a SessionBagInterface for use.
     *
     * @param {Jymfony.Component.HttpFoundation.Session.SessionBagInterface} bag
     */
    registerBag(bag) { }
}

module.exports = getInterface(SessionStorageInterface);
