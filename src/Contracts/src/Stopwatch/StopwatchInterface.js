/**
 * Stopwatch provides a way to profile code.
 *
 * @memberOf Jymfony.Contracts.Stopwatch
 */
class StopwatchInterface {
    /**
     * Gets the sections for the given subject.
     *
     * @param {string|Jymfony.Contracts.HttpFoundation.RequestInterface|Jymfony.Contracts.Console.CommandInterface} [subject]
     *
     * @returns {Jymfony.Contracts.Stopwatch.SectionInterface[]}
     */
    getSections(subject = undefined) { }

    /**
     * Creates a new section or re-opens an existing section.
     *
     * @param {null|string} id The id of the session to re-open, null to create a new one
     *
     * @throws {LogicException} When the section to re-open is not reachable
     */
    openSection(id) { }

    /**
     * Stops the last started section.
     * The id parameter is used to retrieve the events from this section.
     *
     * @see getSectionEvents()
     *
     * @param {string} id The identifier of the section
     *
     * @throws {LogicException} When there's no started section to be stopped
     */
    stopSection(id) { }

    /**
     * Starts an event.
     *
     * @param {string} name
     * @param {null|string} [category]
     *
     * @returns {Jymfony.Contracts.Stopwatch.StopwatchEventInterface}
     */
    start(name, category = null) { }

    /**
     * Checks if the event was started.
     *
     * @param {string} name
     *
     * @returns {boolean}
     */
    isStarted(name) { }

    /**
     * Stops an event.
     *
     * @param {string} name
     *
     * @returns {Jymfony.Contracts.Stopwatch.StopwatchEventInterface}
     */
    stop(name) { }

    /**
     * Stops then restarts an event.
     *
     * @param {string} name
     *
     * @returns {Jymfony.Contracts.Stopwatch.StopwatchEventInterface}
     */
    lap(name) { }

    /**
     * Returns a specific event by name.
     *
     * @param {string} name
     *
     * @returns {Jymfony.Contracts.Stopwatch.StopwatchEventInterface}
     */
    getEvent(name) { }

    /**
     * Gets all events for a given section.
     *
     * @param {string} id
     *
     * @returns {Object.<string, Jymfony.Contracts.Stopwatch.StopwatchEventInterface>}
     */
    getSectionEvents(id) { }
}

export default getInterface(StopwatchInterface);
