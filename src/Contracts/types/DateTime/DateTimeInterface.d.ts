declare namespace Jymfony.Contracts.DateTime {
    /**
     * Represents a datetime.
     * NOTE: this object is immutable. All the methods that modify
     * the object will instead return a new object. If the modified
     * data is equal to the original one, the same object could be
     * returned.
     */
    class DateTimeInterface {
        public static readonly definition: Newable<DateTimeInterface>;
        public static readonly ATOM: string;
        public static readonly COOKIE: string;
        public static readonly ISO8601: string;
        public static readonly RFC822: string;
        public static readonly RFC850: string;
        public static readonly RFC1036: string;
        public static readonly RFC1123: string;
        public static readonly RFC2822: string;
        public static readonly RFC3339: string;
        public static readonly RSS: string;
        public static readonly W3C: string;

        /**
         * The year.
         */
        public readonly year: number;

        /**
         * The day.
         */
        public readonly day: number;

        /**
         * The hour.
         */
        public readonly hour: number;

        /**
         * The minutes.
         */
        public readonly minute: number;

        /**
         * The seconds.
         */
        public readonly second: number;

        /**
         * The milliseconds.
         */
        public readonly millisecond: number;

        /**
         * The timezone.
         */
        public readonly timezone: DateTimeZoneInterface;

        /**
         * Gets the UNIX timestamp.
         */
        public readonly timestamp: number;

        /**
         * Gets the UNIX timestamp with milliseconds.
         */
        public readonly microtime: number;

        /**
         * Gets the Day of Week of this instance.
         * 1 = Monday, 7 = Sunday
         */
        public readonly dayOfWeek: number;

        /**
         * Gets the Day of Year of this instance (1-366).
         */
        public readonly dayOfYear: number;

        /**
         * Indicates whether this instance of DateTime is within
         * the daylight saving time range for the current time zone.
         */
        public readonly isDST: boolean;

        /**
         * Indicates whether the year of this instance of DateTime is a leap year.
         */
        public readonly isLeapYear: boolean;

        /**
         * Modify the time.
         */
        setTime(hours: number, minutes: number, seconds: number, milliseconds?: number): DateTimeInterface;

        /**
         * Modify the date.
         */
        setDate(year: number, month: number, day: number): DateTimeInterface;

        /**
         * Modify the timezone.
         */
        setTimeZone(timezone: DateTimeZoneInterface): DateTimeInterface;

        /**
         * Adds or subtracts a TimeSpan interval.
         */
        modify(interval: TimeSpanInterface): DateTimeInterface;

        /**
         * Returns a copy of the current instance.
         */
        copy(): DateTimeInterface;

        /**
         * Formats a DateTime.
         */
        format(format: string): string;

        /**
         * Returns a value indicating whether this object has
         * the same date time value of the specified instance.
         *
         * @param {Jymfony.Contracts.DateTime.DateTimeInterface} instance
         *
         * @returns {boolean}
         */
        equals(instance: DateTimeInterface): boolean;
    }
}
