declare namespace Jymfony.Component.Crontab {
    import DateTime = Jymfony.Component.DateTime.DateTime;

    type ConstraintType = 'Y'|'M'|'D'|'d'|'h'|'m'|'s';
    type Schedule = Record<string, number[]>;
    interface ScheduleSet {
        schedules: Schedule[],
        exceptions: Schedule[],
    }

    export class Parser {
        /**
         * Parses a cron expression.
         */
        parse(expr: string, now?: DateTime): Crontab;

        /**
         * Returns the value + offset if value is a number, otherwise it
         * attempts to look up the value in the NAMES table and returns
         * that result instead.
         *
         * @param value The value that should be parsed
         * @param [max = 9999] The maximum possible value
         */
        private _getValue(value: number | string, max?: number): number | null;

        /**
         * Adds values to the specified constraint in the current schedule.
         *
         * @param schedule The schedule to add the constraint to
         * @param name Name of constraint to add
         * @param min Minimum value for this constraint
         * @param max Maximum value for this constraint
         * @param [inc = 1] The increment to use between min and max
         */
        private _add(schedule: Schedule, name: ConstraintType, min: number, max: number, inc?: number): void;

        /**
         * Adds a hash item (of the form x#y or xL) to the schedule.
         *
         * @param schedules The current schedule array to add to
         * @param curSchedule The current schedule to add to
         * @param value The value to add (x of x#y or xL)
         * @param hash The hash value to add (y of x#y)
         */
        private _addHash(schedules: Schedule[], curSchedule: Schedule, value: number, hash: number): void;

        private _addWeekday(s: ScheduleSet, curSchedule: Schedule, value: number): void;

        /**
         * Adds a range item (of the form x-y/z) to the schedule.
         *
         * @param item The cron expression item to add
         * @param curSchedule The current schedule to add to
         * @param name The name to use for this constraint
         * @param min The min value for the constraint
         * @param max The max value for the constraint
         */
        private _addRange(item: string, curSchedule: Schedule, name: ConstraintType, min: number, max: number): void;

        /**
         * Parses a particular item within a cron expression.
         *
         * @param item The cron expression item to parse
         * @param s The existing set of schedules
         * @param name The name to use for this constraint
         * @param min The min value for the constraint
         * @param max The max value for the constraint
         */
        private _doParse(item: string | number, s: ScheduleSet, name: ConstraintType, min: number, max: number): void;

        /**
         * Parses each of the fields in a cron expression.  The expression must
         * include the seconds field, the year field is optional.
         *
         * @param expr The cron expression to parse
         */
        private _parseExpr(expr: string): ScheduleSet;
    }
}
