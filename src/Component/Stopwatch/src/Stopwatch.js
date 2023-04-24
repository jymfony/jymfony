const ClsTrait = Jymfony.Contracts.Async.ClsTrait;
const Section = Jymfony.Component.Stopwatch.Section;
const StopwatchInterface = Jymfony.Contracts.Stopwatch.StopwatchInterface;

/**
 * Stopwatch provides a way to profile code.
 *
 * @memberOf Jymfony.Component.Stopwatch
 */
export default class Stopwatch extends implementationOf(StopwatchInterface, ClsTrait) {
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
     * @inheritdoc
     */
    getSections(subject = undefined) {
        if (! subject) {
            return this._sections.get('__root__');
        }

        return this._sections.get(subject) || [];
    }

    /**
     * @inheritdoc
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
     * @inheritdoc
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
     * @inheritdoc
     */
    start(name, category = null) {
        const activeSections = this._getActiveSections();

        return activeSections[activeSections.length - 1].startEvent(name, category);
    }

    /**
     * @inheritdoc
     */
    isStarted(name) {
        const activeSections = this._getActiveSections();

        return activeSections[activeSections.length - 1].isEventStarted(name);
    }

    /**
     * @inheritdoc
     */
    stop(name) {
        const activeSections = this._getActiveSections();

        return activeSections[activeSections.length - 1].stopEvent(name);
    }

    /**
     * @inheritdoc
     */
    lap(name) {
        const activeSections = this._getActiveSections();

        return activeSections[activeSections.length - 1].stopEvent(name).start();
    }

    /**
     * @inheritdoc
     */
    getEvent(name) {
        const activeSections = this._getActiveSections();

        return activeSections[activeSections.length - 1].getEvent(name);
    }

    /**
     * @inheritdoc
     */
    getSectionEvents(id) {
        const sections = this._getSections();

        return sections[id] ? sections[id].getEvents() : {};
    }

    reset() {
        this._sections = new Map();
        this._sections.set('__root__', [
            new Section(),
        ]);

        this._activeSections = new Map();
        this._activeSections.set('__root__', [ ...this._sections.get('__root__') ]);
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
}
