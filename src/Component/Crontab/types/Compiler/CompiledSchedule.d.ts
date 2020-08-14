declare namespace Jymfony.Component.Crontab.Compiler {
    import DateTime = Jymfony.Component.DateTime.DateTime;

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
        start(startDate: DateTime): DateTime;

        /**
         * Given a valid start time, finds the next schedule that is invalid.
         * Useful for finding the end of a valid time range.
         *
         * @param startDate The first possible valid occurrence
         */
        end(startDate: DateTime): DateTime;

        /**
         * Ticks the date by the minimum constraint in this schedule
         *
         * @param date The start date to tick from
         */
        tick(date: DateTime): DateTime;
    }
}
