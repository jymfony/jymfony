const EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
const Section = Jymfony.Component.Stopwatch.Section;
const ClsTrait = __jymfony.ClsTrait;

/**
 * Stopwatch provides a way to profile code.
 *
 * @memberOf Jymfony.Component.Stopwatch
 */
export default class Stopwatch extends implementationOf(EventSubscriberInterface, ClsTrait) {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {Map<string|Jymfony.Component.HttpFoundation.Request|Jymfony.Component.Console.Command.Command, Jymfony.Component.Stopwatch.Section[]>}
         *
         * @private
         */
        this._sections = new Map();
        this._sections.set('__root__', [
            new Section(),
        ]);

        /**
         * @type {Map<string|Jymfony.Component.HttpFoundation.Request|Jymfony.Component.Console.Command.Command, Jymfony.Component.Stopwatch.Section[]>}
         *
         * @private
         */
        this._activeSections = new Map();
        this._activeSections.set('__root__', [ ...this._sections.get('__root__') ]);
    }

    /**
     * Gets the sections for the given subject.
     *
     * @param {string|Jymfony.Component.HttpFoundation.Request|Jymfony.Component.Console.Command.Command} [subject]
     *
     * @return Jymfony.Component.Stopwatch.Section[]
     */
    getSections(subject = undefined) {
        if (! subject) {
            return this._sections.get('__root__');
        }

        return this._sections.get(subject) || [];
    }

    /**
     * Creates a new section or re-opens an existing section.
     *
     * @param {string|null} [id] The id of the session to re-open, null to create a new one
     *
     * @throws {LogicException} When the section to re-open is not reachable
     */
    openSection(id = null) {
        const activeSections = this._getActiveSections();

        const current = activeSections[activeSections.length - 1];
        if (null !== id && null === current.get(id)) {
            throw new LogicException(__jymfony.sprintf('The section "%s" has been started at an other level and can not be opened.', id));
        }

        this.start('__section__.child', 'section');
        activeSections.push(current.open(id));
        this.start('__section__');
    }

    /**
     * Stops the last started section.
     *
     * The id parameter is used to retrieve the events from this section.
     *
     * @see getSectionEvents()
     *
     * @param {string} id The identifier of the section
     *
     * @throws {LogicException} When there's no started section to be stopped
     */
    stopSection(id) {
        this.stop('__section__');

        const activeSections = this._getActiveSections();
        if (null === activeSections || 1 === activeSections.length) {
            throw new LogicException('There is no started section to stop.');
        }

        const sections = this._getSections();
        sections[id] = activeSections.pop().setId(id);
        this.stop('__section__.child');
    }

    /**
     * Starts an event.
     *
     * @param {string} name The event name
     * @param {string|null} [category] The event category
     *
     * @returns {Jymfony.Component.Stopwatch.StopwatchEvent}
     */
    start(name, category = null) {
        const activeSections = this._getActiveSections();

        return activeSections[activeSections.length - 1].startEvent(name, category);
    }

    /**
     * Checks if the event was started.
     *
     * @param {string} name The event name
     *
     * @returns {boolean}
     */
    isStarted(name) {
        const activeSections = this._getActiveSections();

        return activeSections[activeSections.length - 1].isEventStarted(name);
    }

    /**
     * Stops an event.
     *
     * @param {string} name The event name
     *
     * @returns {Jymfony.Component.Stopwatch.StopwatchEvent}
     */
    stop(name) {
        const activeSections = this._getActiveSections();

        return activeSections[activeSections.length - 1].stopEvent(name);
    }

    /**
     * Stops then restarts an event.
     *
     * @param {string} name The event name
     *
     * @returns {Jymfony.Component.Stopwatch.StopwatchEvent}
     */
    lap(name) {
        const activeSections = this._getActiveSections();

        return activeSections[activeSections.length - 1].stopEvent(name).start();
    }

    /**
     * Returns a specific event by name.
     *
     * @param {string} name The event name
     *
     * @returns {Jymfony.Component.Stopwatch.StopwatchEvent}
     */
    getEvent(name) {
        const activeSections = this._getActiveSections();

        return activeSections[activeSections.length - 1].getEvent(name);
    }

    /**
     * Gets all events for a given section.
     *
     * @param {string} id A section identifier
     *
     * @returns {Object.<string, Jymfony.Component.Stopwatch.StopwatchEvent>}
     */
    getSectionEvents(id) {
        const sections = this._getSections();

        return sections[id] ? sections[id].getEvents() : {};
    }

    /**
     * Gets the correct active sections array.
     *
     * @returns {Jymfony.Component.Stopwatch.Section[]}
     *
     * @private
     */
    _getActiveSections() {
        const subject = this._activeContext[ClsTrait.REQUEST_SYMBOL] || this._activeContext[ClsTrait.COMMAND_SYMBOL] || '__root__';
        if (! this._activeSections.has(subject)) {
            this._activeSections.set(subject, [ ...this._getSections() ]);
        }

        return this._activeSections.get(subject);
    }

    /**
     * Gets the correct sections array.
     *
     * @returns {Jymfony.Component.Stopwatch.Section[]}
     *
     * @private
     */
    _getSections() {
        const subject = this._activeContext[ClsTrait.REQUEST_SYMBOL] || this._activeContext[ClsTrait.COMMAND_SYMBOL] || '__root__';

        return this._sections.has(subject) ? this._sections.get(subject) : (this._sections.set(subject, [ new Section() ]), this._sections.get(subject));
    }

    /**
     * @inheritdoc
     */
    static getSubscribedEvents() {
        return {
            'console.command': [ '_onConsoleCommand', 1024 ],
            'console.terminate': [ '_onConsoleTerminate', -1024 ],
            'http.request': [ '_onHttpRequest', 1024 ],
            'http.finish_request': [ '_onHttpFinishRequest', -1024 ],
        };
    }
}
