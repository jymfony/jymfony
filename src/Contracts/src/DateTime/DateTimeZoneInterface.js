/**
 * The DateTimeZone represents a timezone definition.
 * To get one please use DateTimeZone.get method.
 *
 * @memberOf Jymfony.Contracts.DateTime
 */
class DateTimeZoneInterface {
    /**
     * Gets the timezone name.
     *
     * @returns {string}
     */
    get name() { }

    /**
     * Get the offset for a given datetime or timestamp.
     *
     * @param {Jymfony.Contracts.DateTime.DateTimeInterface|int} datetime
     *
     * @returns {int|undefined}
     */
    getOffset(datetime) { }

    /**
     * Gets the timezone abbrev name for a given timestamp or DateTime.
     *
     * @param {Jymfony.Contracts.DateTime.DateTimeInterface|int} datetime
     *
     * @returns {string}
     */
    getAbbrev(datetime) { }

    /**
     * Checks if DST is applicable for a given timestamp or DateTime.
     *
     * @param {Jymfony.Contracts.DateTime.DateTimeInterface|int} datetime
     *
     * @returns {boolean}
     */
    isDST(datetime) { }
}

export default getInterface(DateTimeZoneInterface);
