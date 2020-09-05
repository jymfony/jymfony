import abbreviations from '../data/abbrevs.json';
import zones from '../data/zones.json';

const DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;
const DateTimeZoneInterface = Jymfony.Contracts.DateTime.DateTimeZoneInterface;
const Parser = Jymfony.Component.DateTime.Parser.Parser;
const TimeDescriptor = Jymfony.Component.DateTime.Struct.TimeDescriptor;
const UnknownTimeZoneException = Jymfony.Component.DateTime.Exception.UnknownTimeZoneException;

const instances = new BTree();
const collator = new Intl.Collator('en');

/**
 * The DateTimeZone represents a timezone definition.
 * To get one please use DateTimeZone.get method.
 *
 * @memberOf Jymfony.Component.DateTime
 */
export default class DateTimeZone extends implementationOf(DateTimeZoneInterface) {
    /**
     * Constructor.
     */
    __construct() {
        throw new Error('Object DateTimeZone cannot be constructed with new. Please use DateTimeZone.get instead');
    }

    /**
     * Gets a DateTimeZone object for the specified timezone.
     *
     * @param {string} timezone
     *
     * @returns {DateTimeZone}
     */
    static get(timezone) {
        let o = instances.get(timezone);
        if (undefined === o) {
            const reflClass = new ReflectionClass('Jymfony.Component.DateTime.DateTimeZone');
            o = reflClass.newInstanceWithoutConstructor();

            o._load(timezone);
            instances.push(timezone, o);
        }

        return o;
    }

    /**
     * @returns {string[]}
     */
    static get identifiers() {
        return [ ...zones ];
    }

    /**
     * Gets the timezone name.
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Get the offset for a given datetime or timestamp.
     *
     * @param {Jymfony.Contracts.DateTime.DateTimeInterface|int} datetime
     *
     * @returns {int|undefined}
     */
    getOffset(datetime) {
        if (datetime instanceof DateTimeInterface) {
            datetime = datetime.timestamp;
        }

        const data = this._getData(datetime);
        if (undefined === data) {
            return undefined;
        }

        return ~~data.offset;
    }

    /**
     * Gets the timezone abbrev name for a given timestamp or DateTime.
     *
     * @param {Jymfony.Contracts.DateTime.DateTimeInterface|int} datetime
     *
     * @returns {string}
     */
    getAbbrev(datetime) {
        const found = this._getData(datetime);
        if (undefined === found) {
            return 'UTC';
        }

        return found.abbrev;
    }

    /**
     * Checks if DST is applicable for a given timestamp or DateTime.
     *
     * @param {Jymfony.Contracts.DateTime.DateTimeInterface|int} datetime
     *
     * @returns {boolean}
     */
    isDST(datetime) {
        const found = this._getData(datetime);
        if (undefined === found) {
            return false;
        }

        return !! found.dst;
    }

    /**
     * Get the GMT offset for wall clock time.
     *
     * @param {int} wallTimestamp
     *
     * @returns {int}
     *
     * @internal
     */
    _getOffsetForWallClock(wallTimestamp) {
        const data = this._getData(wallTimestamp, true);
        if (undefined !== data) {
            return data.offset;
        }

        return 0;
    }

    /**
     * Gets the data for a given timestamp or DateTime.
     *
     * @param {Jymfony.Contracts.DateTime.DateTimeInterface|int} datetime
     * @param {boolean} wallTs
     *
     * @returns {*}
     *
     * @private
     */
    _getData(datetime, wallTs = false) {
        if (datetime instanceof DateTimeInterface) {
            datetime = datetime.timestamp;
        }

        let data = this._data.search(datetime + 1, BTree.COMPARISON_GREATER)[1];
        if (wallTs) {
            data = this._data.search(datetime - data.offset + 1, BTree.COMPARISON_GREATER)[1];
        }

        if (!!data.ruleSet) {
            const descriptor = new TimeDescriptor(0);
            descriptor.unixTimestamp = datetime - (wallTs ? data.offset : 0);

            const transitionMap = new Map();
            transitionMap.set('0', { rule: { save: 0 }, offset: data.offset });

            for (const year of [ descriptor._year - 1, descriptor._year ]) {
                for (const rule of data.ruleSet.getRulesForYear(year)) {
                    const [ transitionTime, withSave ] = rule.getTransitionTime(year, data.offset);
                    transitionMap.set(transitionTime, { rule, offset: data.offset, withSave });
                }
            }

            const transitions = [ ...transitionMap.entries() ].sort((a, b) => collator.compare(a[0], b[0]));

            let lastRule = null;
            for (let [ transitionTime, transition ] of transitions) {
                const tm = descriptor.copy();
                if (transitionTime.endsWith('u')) {
                    transitionTime = transitionTime.replace(/u$/, '');
                    tm._addSeconds(-1 * (transition.rule.save + lastRule.rule.save) + transition.offset);
                } else if (null !== lastRule) {
                    tm._addSeconds(lastRule.rule.save + lastRule.offset);
                }

                const currentTime = __jymfony.sprintf('%06d-%02d-%02dT%02d:%02d:%02d', tm._year, tm.month, tm.day, tm.hour, tm.minutes, tm.seconds);
                const compare = collator.compare(currentTime, transitionTime);
                if (-1 === compare || (wallTs && 0 === compare)) {
                    break;
                } else if (wallTs && 1 === compare) {
                    const withSave = transition.withSave;
                    if (withSave && -1 === collator.compare(currentTime, withSave)) {
                        break;
                    }
                }

                lastRule = transition;
            }

            const abbrev = -1 !== data.abbrev.indexOf('%s') ?
                __jymfony.sprintf(data.abbrev, '-' === lastRule.rule.letters ? '' : lastRule.rule.letters) :
                data.abbrev;

            return { offset: lastRule.offset + lastRule.rule.save, dst: 0 !== lastRule.rule.save, abbrev };
        }

        return data;
    }

    /**
     * Loads a timezone by name/abbreviation or try to parse
     * a timezone correction.
     *
     * @param timezone
     *
     * @private
     */
    _load(timezone) {
        this._name = timezone;
        this._data = new BTree();

        let correction;

        if (-1 !== zones.indexOf(timezone)) {
            const data = require('../data/timezones/' + timezone).default;
            this._data.push(-Infinity, {
                offset: 0,
                dst: false,
                abbrev: 'GMT',
                until: Number.MIN_SAFE_INTEGER + 1,
            });

            for (const descriptor of data) {
                this._data.push(descriptor.until, descriptor);
            }
        } else if (-1 !== abbreviations.indexOf(timezone)) {
            const descriptor = require(`../data/abbrev/${timezone}.js`).default;
            this._data.push(-Infinity, descriptor);
            this._data.push(Infinity, descriptor);
        } else if (undefined !== (correction = Parser.parseTzCorrection(timezone))) {
            this._data.push(-Infinity, { offset: correction, dst: false, abbrev: timezone, until: Number.MIN_SAFE_INTEGER + 1 });
            this._data.push(Infinity, { offset: correction, dst: false, abbrev: timezone, until: Number.MAX_SAFE_INTEGER - 1 });
        } else {
            throw new UnknownTimeZoneException(`Timezone ${timezone} does not exist.`);
        }
    }
}

class NullTimeZone extends DateTimeZone {
    /**
     * @inheritdoc
     */
    getOffset() {
        return 0;
    }

    /**
     * @inheritdoc
     */
    getAbbrev() {
        return '';
    }

    /**
     * @inheritdoc
     */
    isDST() {
        return false;
    }

    /**
     * @inheritdoc
     */
    _getOffsetForWallClock() {
        return 0;
    }
}

const nullTimeZoneCtor = function () { };
nullTimeZoneCtor.prototype = NullTimeZone.prototype;

instances.push(0, new nullTimeZoneCtor());
