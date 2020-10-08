declare namespace Jymfony.Contracts.DateTime {
    /**
     * The DateTimeZone represents a timezone definition.
     * To get one please use DateTimeZone.get method.
     */
    export class DateTimeZoneInterface {
        public static readonly definition: Newable<DateTimeZoneInterface>;

        /**
         * Gets the timezone name.
         */
        public readonly name: string;

        /**
         * Get the offset for a given datetime or timestamp.
         */
        getOffset(datetime: DateTimeInterface): undefined | number;

        /**
         * Gets the timezone abbrev name for a given timestamp or DateTime.
         */
        getAbbrev(datetime: DateTimeInterface | number): string;

        /**
         * Checks if DST is applicable for a given timestamp or DateTime.
         *
         * @param {Jymfony.Contracts.DateTime.DateTimeInterface|int} datetime
         *
         * @returns {boolean}
         */
        isDST(datetime: DateTimeInterface | number): boolean;
    }
}
