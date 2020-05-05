declare namespace Jymfony.Component.DateTime {
    export class DateTime {
        static readonly ATOM = 'Y-m-d\\TH:i:sP' ;
        static readonly COOKIE = 'l, d-M-Y H:i:s T' ;
        static readonly ISO8601 = 'Y-m-d\\TH:i:sO' ;
        static readonly RFC822 = 'D, d M y H:i:s O' ;
        static readonly RFC850 = 'l, d-M-y H:i:s T' ;
        static readonly RFC1036 = 'D, d M y H:i:s O' ;
        static readonly RFC1123 = 'D, d M Y H:i:s O' ;
        static readonly RFC2822 = 'D, d M Y H:i:s O' ;
        static readonly RFC3339 = 'Y-m-d\\TH:i:sP' ;
        static readonly RSS = 'D, d M Y H:i:s O' ;
        static readonly W3C = 'Y-m-d\\TH:i:sP' ;

        /**
         * Constructor.
         */
        constructor(datetime?: undefined | string | number | Date, timezone?: undefined | string | DateTimeZone);

        /**
         * Parse a string into a new DateTime object according to the specified format
         */
        static createFromFormat(format: string, time: string, timezone?: undefined | string | DateTimeZone): DateTime;

        /**
         * Gets a new DateTime representing the current datetime.
         */
        static readonly now: DateTime;

        /**
         * Gets current timestamp.
         */
        static readonly unixTime: number;

        /**
         * Gets a new DateTime representing midnight of today.
         */
        static readonly today: DateTime;

        /**
         * Gets a new DateTime representing midnight of today.
         */
        static readonly yesterday: DateTime;

        /**
         * Gets the year.
         */
        readonly year: number;

        /**
         * Gets the month.
         */
        readonly month: number;

        /**
         * Gets the day.
         */
        readonly day: number;

        /**
         * Gets the hour.
         */
        readonly hour: number;

        /**
         * Gets the minutes.
         */
        readonly minute: number;

        /**
         * Gets the seconds.
         */
        readonly second: number;

        /**
         * Gets the milliseconds.
         */
        readonly millisecond: number;

        /**
         * Gets the timezone.
         */
        readonly timezone: DateTimeZone;

        /**
         * Gets the UNIX timestamp.
         */
        readonly timestamp: number;

        /**
         * Gets the UNIX timestamp with milliseconds.
         */
        readonly microtime: number;

        /**
         * Gets the Day of Week of this instance.
         * 1 = Monday, 7 = Sunday
         */
        readonly dayOfWeek: number;

        /**
         * Gets the Day of Year of this instance (1-366).
         */
        readonly dayOfYear: number;

        /**
         * Indicates whether this instance of DateTime is within
         * the daylight saving time range for the current time zone.
         */
        readonly isDST: boolean;

        /**
         * Indicates whether the year of this instance of DateTime is a leap year.
         */
        readonly isLeapYear: boolean;

        /**
         * Modify the time.
         */
        setTime(hours: number, minutes: number, seconds: number, milliseconds?: number): DateTime;

        /**
         * Modify the date.
         */
        setDate(year: number, month: number, day: number): DateTime;

        /**
         * Modify the timezone.
         */
        setTimeZone(timezone: DateTimeZone): DateTime;

        /**
         * Adds or subtracts a TimeSpan interval.
         */
        modify(interval: TimeSpan): DateTime;

        /**
         * Returns a copy of the current instance.
         */
        copy(): DateTime;

        /**
         * Formats a DateTime.
         */
        format(format: string): string;

        /**
         * Returns a value indicating whether this object has
         * the same date time value of the specified instance.
         */
        equals(instance: DateTime): boolean;

        /**
         * @inheritdoc
         */
        toString(): string;
    }
}
