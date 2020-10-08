declare namespace Jymfony.Component.Crontab.Constraints {
    import DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;

    export class PeriodInterface {
        public static readonly definition: Newable<PeriodInterface>;

        /**
         * Returns the start of the day.
         */
        start(d: DateTimeInterface): DateTimeInterface;

        /**
         * Returns the end of the day.
         */
        end(d: DateTimeInterface): DateTimeInterface;

        /**
         * Returns the start of the next instance of the day value indicated. Returns
         * the first day of the next month if val is greater than the number of
         * days in the following month.
         *
         * @param d The starting date
         * @param val The desired value, must be within extent
         */
        next(d: DateTimeInterface, val: number): DateTimeInterface;
    }
}
