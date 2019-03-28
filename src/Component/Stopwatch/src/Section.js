const StopwatchEvent = Jymfony.Component.Stopwatch.StopwatchEvent;
const { performance } = require('perf_hooks');

/**
 * Stopwatch section.
 *
 * @memberOf Jymfony.Component.Stopwatch
 */
class Section {
    /**
     * Constructor.
     *
     * @param {number|null} origin Set the origin of the events in this section, use null to set their origin to their start time
     */
    __construct(origin = null) {
        /**
         * @type {Object.<string, Jymfony.Component.Stopwatch.StopwatchEvent>}
         *
         * @private
         */
        this._events = {};

        /**
         * @type {number}
         *
         * @private
         */
        this._origin = origin;

        /**
         * @type {string}
         *
         * @private
         */
        this._id = undefined;

        /**
         * @type {Jymfony.Component.Stopwatch.Section[]}
         *
         * @private
         */
        this._children = [];
    }

    /**
     * Returns the child section.
     *
     * @param {string} id The child section identifier
     *
     * @returns {Jymfony.Component.Stopwatch.Section|undefined} The child section or null when none found
     */
    get(id) {
        for (const child of this._children) {
            if (id === child.id) {
                return child;
            }
        }

        return undefined;
    }

    /**
     * Creates or re-opens a child section.
     *
     * @param {string|null} id Null to create a new section, the identifier to re-open an existing one
     *
     * @returns {Jymfony.Component.Stopwatch.Section}
     */
    open(id) {
        let section = this.get(id);
        if (undefined === section) {
            section = new __self((performance.now() + performance.timeOrigin) / 1000);
            this._children.push(section);
        }

        return section;
    }

    /**
     * Gets the identifier of the section
     *
     * @returns {string} The identifier of the section
     */
    get id() {
        return this._id;
    }

    /**
     * Sets the section identifier.
     *
     * @param {string} id The section identifier
     *
     * @returns {Jymfony.Component.Stopwatch.Section}
     */
    setId(id) {
        this._id = id;

        return this;
    }

    /**
     * Starts an event.
     *
     * @param {string} name The event name
     * @param {string} category The event category
     *
     * @returns {Jymfony.Component.Stopwatch.StopwatchEvent} The event
     */
    startEvent(name, category) {
        if (! this._events[name]) {
            this._events[name] = new StopwatchEvent(this._origin || (performance.now() + performance.timeOrigin) / 1000, category);
        }

        return this._events[name].start();
    }

    /**
     * Checks if the event was started.
     *
     * @param {string} name The event name
     *
     * @returns {boolean}
     */
    isEventStarted(name) {
        return !! (this._events[name] && this._events[name].isStarted());
    }

    /**
     * Stops an event.
     *
     * @param {string} name The event name
     *
     * @returns {Jymfony.Component.Stopwatch.StopwatchEvent} The event
     *
     * @throws {LogicException} When the event has not been started
     */
    stopEvent(name) {
        if (! this._events[name]) {
            throw new LogicException(__jymfony.sprintf('Event "%s" is not started.', name));
        }

        return this._events[name].stop();
    }

    /**
     * Stops then restarts an event.
     *
     * @param {string} name The event name
     *
     * @returns {Jymfony.Component.Stopwatch.StopwatchEvent} The event
     *
     * @throws {LogicException} When the event has not been started
     */
    lap(name) {
        return this.stopEvent(name).start();
    }

    /**
     * Returns a specific event by name.
     *
     * @param {string} name The event name
     *
     * @returns {Jymfony.Component.Stopwatch.StopwatchEvent} The event
     *
     * @throws {LogicException} When the event is not known
     */
    getEvent(name) {
        if (! this._events[name]) {
            throw new LogicException(__jymfony.sprintf('Event "%s" is not known.', name));
        }

        return this._events[name];
    }

    /**
     * Returns the events from this section.
     *
     * @returns {Object.<string, Jymfony.Component.Stopwatch.StopwatchEvent>} A map of StopwatchEvent instances
     */
    getEvents() {
        return Object.assign({}, this._events);
    }
}

module.exports = Section;
