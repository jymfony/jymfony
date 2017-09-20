const DateTime = Jymfony.Component.DateTime.DateTime;
const UnknownTimeZoneException = Jymfony.Component.DateTime.Exception.UnknownTimeZoneException;
const Parser = Jymfony.Component.DateTime.Parser.Parser;

/**
 * @type {[string]}
 */
const zones = require('../data/zones.json');
const abbreviations = require('../data/abbrevs.json');
const instances = new BTree();

/**
 * The DateTimeZone represents a timezone definition.
 * To get one please use DateTimeZone.get method.
 *
 * @memberOf Jymfony.Component.DateTime
 * @type DateTimeZone
 */
class DateTimeZone {
    __construct() {
        throw new Error('Object DateTimeZone cannot be constructed with new. Please use DateTimeZone.get instead');
    }

    /**
     * Gets a DateTimeZone object for the specified timezone
     *
     * @param {string} timezone
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
     *
     * @returns {[string]}
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
     * Get the offset for a given datetime or timestamp
     *
     * @param {Jymfony.Component.DateTime.DateTime|int} datetime
     *
     * @returns {int|undefined}
     */
    getOffset(datetime) {
        const found = this._getData(datetime);
        if (undefined === found) {
            return undefined;
        }

        return ~~found[1].gmt_offset;
    }

    /**
     * Gets the timezone abbrev name for a given datetime/timestamp
     *
     * @param {Jymfony.Component.DateTime.DateTime|int} datetime
     *
     * @returns {string}
     */
    getAbbrev(datetime) {
        const found = this._getData(datetime);
        if (undefined === found) {
            return 'UTC';
        }

        return found[1].abbrev;
    }

    /**
     * Checks if DST is applicable for given timestamp or DateTime
     *
     * @param {Jymfony.Component.DateTime.DateTime|int} datetime
     * @returns {boolean}
     */
    isDST(datetime) {
        const found = this._getData(datetime);
        if (undefined === found) {
            return false;
        }

        return !! found[1].dst;
    }

    /**
     * Get the GMT offset for wall clock time
     *
     * @param {int} wallTimestamp
     *
     * @returns {int}
     * @internal
     */
    _getOffsetForWallClock(wallTimestamp) {
        const found = this._transitions.search(wallTimestamp - 1, BTree.COMPARISON_LESSER);
        if (undefined === found) {
            return 0;
        }

        return found[1].gmt_offset;
    }

    /**
     * Gets the data for a given datetime/timestamp
     *
     * @param {Jymfony.Component.DateTime.DateTime|int} datetime
     *
     * @returns {Array}
     * @private
     */
    _getData(datetime) {
        if (datetime instanceof DateTime) {
            datetime = datetime.timestamp;
        }

        return this._data.search(datetime, BTree.COMPARISON_LESSER);
    }

    /**
     * Loads a timezone by name/abbreviation or try to parse
     * a timezone correction.
     *
     * @param timezone
     * @private
     */
    _load(timezone) {
        this._name = timezone;
        this._data = new BTree();

        let correction;

        if (-1 !== zones.indexOf(timezone)) {
            const data = require('../data/timezones/' + timezone);
            this._data.push(-Infinity, {
                gmt_offset: 0,
                dst: false,
                abbrev: 'GMT',
            });

            for (const [ timestamp, descriptor ] of __jymfony.getEntries(data)) {
                this._data.push(timestamp - 0, {
                    gmt_offset: ~~(descriptor.gmt_offset),
                    dst: !! descriptor.dst,
                    abbrev: descriptor.abbrev,
                });
            }
        } else if (-1 !== abbreviations.indexOf(timezone)) {
            const descriptor = require(`../data/abbrev/${timezone}.json`);
            this._data.push(-Infinity, {
                gmt_offset: ~~(descriptor.gmt_offset),
                dst: !! descriptor.dst,
                abbrev: descriptor.abbrev,
            });
        } else if (undefined !== (correction = Parser.parseTzCorrection(timezone))) {
            this._data.push(-Infinity, {
                gmt_offset: correction,
                dst: false,
                abbrev: timezone,
            });
        } else {
            throw new UnknownTimeZoneException(`Timezone ${timezone} does not exist.`);
        }

        this._transitions = new BTree();
        let previous = 0;
        for (const [ timestamp, descriptor ] of this._data) {
            const wall_clock = timestamp + previous;
            previous = ~~descriptor.gmt_offset;
            this._transitions.push(wall_clock, descriptor);
        }
    }
}

module.exports = DateTimeZone;
