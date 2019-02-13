declare namespace Jymfony.Component.DateTime {
    /**
     * The DateTimeZone represents a timezone definition.
     * To get one please use DateTimeZone.get method.
     */
    export class DateTimeZone {
        /**
         * Gets a DateTimeZone object for the specified timezone.
         */
        static get(timezone: string): DateTimeZone;

        static readonly identifiers: string[];

        /**
         * Gets the timezone name.
         */
        readonly name: string;

        /**
         * Get the offset for a given datetime or timestamp.
         */
        getOffset(datetime: DateTime|number): number|undefined;

        /**
         * Gets the timezone abbrev name for a given timestamp or DateTime.
         */
        getAbbrev(datetime: DateTime|number): string;

        /**
         * Checks if DST is applicable for a given timestamp or DateTime.
         */
        isDST(datetime: DateTime|number): boolean;

        /**
         * Get the GMT offset for wall clock time.
         */
        private _getOffsetForWallClock(wallTimestamp: number): number;

        /**
         * Gets the data for a given timestamp or DateTime.
         */
        private _getData(datetime: DateTime|number): any[];

        /**
         * Loads a timezone by name/abbreviation or try to parse
         * a timezone correction.
         */
        private _load(timezone: string): void;
    }
}
