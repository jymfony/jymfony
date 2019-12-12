import { performance } from 'perf_hooks';

const SectionInterface = Jymfony.Contracts.Stopwatch.SectionInterface;
const StopwatchEvent = Jymfony.Component.Stopwatch.StopwatchEvent;

/**
 * Stopwatch section.
 *
 * @memberOf Jymfony.Component.Stopwatch
 */
export default class Section extends implementationOf(SectionInterface) {
    /**
     * Constructor.
     *
     * @param {number|null} [origin] Set the origin of the events in this section, use null to set their origin to their start time
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
     * @inheritdoc
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
     * @inheritdoc
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
     * @inheritdoc
     */
    get id() {
        return this._id;
    }

    /**
     * @inheritdoc
     */
    setId(id) {
        this._id = id;

        return this;
    }

    /**
     * @inheritdoc
     */
    startEvent(name, category) {
        if (! this._events[name]) {
            this._events[name] = new StopwatchEvent(this._origin || (performance.now() + performance.timeOrigin) / 1000, category);
        }

        return this._events[name].start();
    }

    /**
     * @inheritdoc
     */
    isEventStarted(name) {
        return !! (this._events[name] && this._events[name].isStarted());
    }

    /**
     * @inheritdoc
     */
    stopEvent(name) {
        if (! this._events[name]) {
            throw new LogicException(__jymfony.sprintf('Event "%s" is not started.', name));
        }

        return this._events[name].stop();
    }

    /**
     * @inheritdoc
     */
    lap(name) {
        return this.stopEvent(name).start();
    }

    /**
     * @inheritdoc
     */
    getEvent(name) {
        if (! this._events[name]) {
            throw new LogicException(__jymfony.sprintf('Event "%s" is not known.', name));
        }

        return this._events[name];
    }

    /**
     * @inheritdoc
     */
    getEvents() {
        return Object.assign({}, this._events);
    }
}
