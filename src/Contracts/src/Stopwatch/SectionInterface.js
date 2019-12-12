/**
 * Stopwatch section.
 *
 * @memberOf Jymfony.Contracts.Stopwatch
 */
class SectionInterface {
    /**
     * Returns the child section.
     *
     * @param {string} id The child section identifier
     *
     * @returns {Jymfony.Contracts.Stopwatch.SectionInterface|undefined} The child section or null when none found
     */
    get(id) { }

    /**
     * Creates or re-opens a child section.
     *
     * @param {string|null} id Null to create a new section, the identifier to re-open an existing one
     *
     * @returns {Jymfony.Contracts.Stopwatch.SectionInterface}
     */
    open(id) { }

    /**
     * Gets the identifier of the section
     *
     * @returns {string} The identifier of the section
     */
    get id() { }

    /**
     * Sets the section identifier.
     *
     * @param {string} id The section identifier
     *
     * @returns {Jymfony.Contracts.Stopwatch.SectionInterface}
     */
    setId(id) { }

    /**
     * Starts an event.
     *
     * @param {string} name The event name
     * @param {string} category The event category
     *
     * @returns {Jymfony.Contracts.Stopwatch.StopwatchEventInterface} The event
     */
    startEvent(name, category) { }

    /**
     * Checks if the event was started.
     *
     * @param {string} name The event name
     *
     * @returns {boolean}
     */
    isEventStarted(name) { }

    /**
     * Stops an event.
     *
     * @param {string} name The event name
     *
     * @returns {Jymfony.Contracts.Stopwatch.StopwatchEventInterface} The event
     *
     * @throws {LogicException} When the event has not been started
     */
    stopEvent(name) { }

    /**
     * Stops then restarts an event.
     *
     * @param {string} name The event name
     *
     * @returns {Jymfony.Contracts.Stopwatch.StopwatchEventInterface} The event
     *
     * @throws {LogicException} When the event has not been started
     */
    lap(name) { }

    /**
     * Returns a specific event by name.
     *
     * @param {string} name The event name
     *
     * @returns {Jymfony.Contracts.Stopwatch.StopwatchEventInterface} The event
     *
     * @throws {LogicException} When the event is not known
     */
    getEvent(name) { }

    /**
     * Returns the events from this section.
     *
     * @returns {Object.<string, Jymfony.Contracts.Stopwatch.StopwatchEventInterface>} A map of StopwatchEvent instances
     */
    getEvents() { }
}

export default getInterface(SectionInterface);
