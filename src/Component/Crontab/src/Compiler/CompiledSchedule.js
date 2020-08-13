import { NEVER, nextInvalidVal, nextVal } from '../util';

const Constraints = Jymfony.Component.Crontab.Constraints;
const TimeSpan = Jymfony.Component.DateTime.TimeSpan;
const SECOND = new TimeSpan('PT1S');

/**
 * @memberOf Jymfony.Component.Crontab.Compiler
 */
export default class CompiledSchedule {
    /**
     * Constructor.
     *
     * @param {{constraint: Jymfony.Component.Crontab.Constraints.ConstraintInterface & Jymfony.Component.Crontab.Constraints.PeriodInterface, values: int[]}[]} constraints
     */
    __construct(constraints) {
        /**
         * @type {{constraint: Jymfony.Component.Crontab.Constraints.ConstraintInterface & Jymfony.Component.Crontab.Constraints.PeriodInterface, values: int[]}[]}
         *
         * @private
         */
        this._constraints = constraints;

        /**
         * This is the smallest constraint, we use this one to tick the schedule when
         * finding multiple instances
         *
         * @type {Jymfony.Component.Crontab.Constraints.PeriodInterface}
         *
         * @private
         */
        this._tickPeriod = constraints.length ? constraints[constraints.length - 1].constraint : new Constraints.Second();
    }

    /**
     * Calculates the start of the next valid occurrence of a particular schedule
     * that occurs on or after the specified start time.
     *
     * @param {Jymfony.Component.DateTime.DateTime} startDate The first possible valid occurrence
     */
    start(startDate) {
        let next = startDate;
        let done;

        while (!done && next && next !== NEVER) {
            done = true;

            // Verify all of the constraints in order since we want to make the
            // Largest jumps possible to find the first valid value
            for (const { constraint, values } of this._constraints) {
                const curVal = constraint.val(next);
                const extent = constraint.extent(next);
                const newVal = nextVal(curVal, values, extent);

                if (!constraint.isValid(next, newVal)) {
                    next = constraint.next(next, newVal);
                    done = false;

                    break; // Need to retest all constraints with new date
                }
            }
        }

        if (next !== NEVER) {
            next = this._tickPeriod.start(next);
        }

        // If next, move to start of time period. needed when moving backwards
        return next;
    }

    /**
     * Given a valid start time, finds the next schedule that is invalid.
     * Useful for finding the end of a valid time range.
     *
     * @param {Jymfony.Component.DateTime.DateTime} startDate The first possible valid occurrence
     */
    end(startDate) {
        let result;

        for (let i = this._constraints.length - 1; 0 <= i; i--) {
            const { constraint, values } = this._constraints[i];
            const curVal = constraint.val(startDate);
            const extent = constraint.extent(startDate);
            const newVal = nextInvalidVal(curVal, values, extent);
            let next;

            if (newVal !== undefined) { // Constraint has invalid value, use that
                next = constraint.next(startDate, newVal);
                if (next && (! result || result.timestamp > next.timestamp)) {
                    result = next;
                }
            }
        }

        return result;
    }

    /**
     * Ticks the date by the minimum constraint in this schedule
     *
     * @param {Jymfony.Component.DateTime.DateTime} date The start date to tick from
     */
    tick(date) {
        return this._tickPeriod.end(date.modify(SECOND));
    }
}
