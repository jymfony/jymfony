/**
 * Interface for the session.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Session
 */
class SessionInterface {
    /**
     * Starts the session storage.
     *
     * @returns {Promise<void>}
     *
     * @throws {RuntimeException} if session fails to start
     */
    async start() { }

    /**
     * Returns the session ID.
     *
     * @returns {string} The session ID
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
     * @returns {string} The session name
     */
    get name() { }

    /**
     * Sets the session name.
     *
     * @param {string} name
     */
    set name(name) { }

    /**
     * Invalidates the current session.
     *
     * Clears all session attributes and flashes and regenerates the
     * session and deletes the old session from persistence.
     *
     * @param {int} [lifetime = 0] Sets the cookie lifetime for the session cookie. 0 sets the cookie
     *                             to expire with browser session. Time is in seconds, and is
     *                             not a Unix timestamp.
     *
     * @returns {Promise<void>}
     */
    async invalidate(lifetime = 0) { }

    /**
     * Migrates the current session to a new session id while maintaining all
     * session attributes.
     *
     * @param {boolean} [destroy = false] Whether to delete the old session or leave it to garbage collection
     * @param {int} [lifetime = 0] Sets the cookie lifetime for the session cookie. 0 sets the cookie
     *                             to expire with browser session. Time is in seconds, and is
     *                             not a Unix timestamp.
     *
     * @returns {Promise<void>}
     */
    async migrate(destroy = false, lifetime = 0) { }

    /**
     * Force the session to be saved and closed.
     *
     * @returns {Promise<void>}
     */
    async save() { }

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
     * @returns {Object.<string, *>}
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

    /**
     * Clears all attributes.
     */
    clear() { }

    /**
     * Checks if the session was started.
     *
     * @returns {boolean}
     */
    get started() { }

    /**
     * Registers a SessionBagInterface with the session.
     *
     * @param {Jymfony.Component.HttpFoundation.Session.SessionBagInterface} bag
     */
    registerBag(bag) { }

    /**
     * Gets a bag instance by name.
     *
     * @param {string} name
     *
     * @returns {Jymfony.Component.HttpFoundation.Session.SessionBagInterface}
     */
    getBag(name) { }

    /**
     * Gets session meta.
     *
     * @returns {Jymfony.Component.HttpFoundation.Session.AttributeBagInterface}
     */
    get attributesBag() { }

    /**
     * Gets session flashes.
     *
     * @returns {Jymfony.Component.HttpFoundation.Session.Flash.FlashBagInterface}
     */
    get flashBag() { }
}

module.exports = getInterface(SessionInterface);
