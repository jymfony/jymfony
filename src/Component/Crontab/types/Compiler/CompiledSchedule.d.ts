declare namespace Jymfony.Component.Crontab.Compiler {
    import DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;

    interface InputConstraint {
        constraint: Jymfony.Component.Crontab.Constraints.ConstraintInterface & Jymfony.Component.Crontab.Constraints.PeriodInterface,
        values: number[],
    }

    export class CompiledSchedule {
        private _constraints: InputConstraint[];
        private _tickPeriod: Jymfony.Component.Crontab.Constraints.PeriodInterface;

        /**
         * Constructor.
         */
        __construct(constraints: InputConstraint[]): void;
        constructor(constraints: InputConstraint[]);

        /**
         * Calculates the start of the next valid occurrence of a particular schedule
         * that occurs on or after the specified start time.
         *
         * @param startDate The first possible valid occurrence
         */
        start(startDate: DateTimeInterface): DateTimeInterface;

        /**
         * Given a valid start time, finds the next schedule that is invalid.
         * Useful for finding the end of a valid time range.
         *
         * @param startDate The first possible valid occurrence
         */
        end(startDate: DateTimeInterface): DateTimeInterface;

        /**
         * Ticks the date by the minimum constraint in this schedule
         *
         * @param date The start date to tick from
         */
        tick(date: DateTimeInterface): DateTimeInterface;
    }
}
