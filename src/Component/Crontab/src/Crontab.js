import {
    NEVER,
    calcRangeOverlap,
    findNext,
    tickStarts,
    updateNextStarts,
    updateRangeStarts
} from './util';

const Compiler = Jymfony.Component.Crontab.Compiler.Compiler;

/**
 * @memberOf Jymfony.Component.Crontab
 */
export default class Crontab {
    /**
     * Constructor.
     *
     * @param {Object.<string, *>} schedule
     * @param {Jymfony.Contracts.DateTime.DateTimeInterface} currentDate
     */
    __construct(schedule, currentDate) {
        this._schedules = schedule.schedules.map(Compiler.compile);
        this._exceptions = schedule.exceptions.map(Compiler.compile);

        /**
         * @type {Jymfony.Contracts.DateTime.DateTimeInterface}
         *
         * @private
         */
        this._currentDate = currentDate;
    }

    * [Symbol.iterator]() {
        const scheduleStarts = this._schedules.map(schedule => schedule.start(this._currentDate));
        const exceptsStarts = this._exceptions.map(except => {
            const nextStart = except.start(this._currentDate);

            if (! nextStart) {
                return NEVER;
            }

            return [ nextStart, except.end(nextStart) ];
        });

        let next;
        while (next = findNext(scheduleStarts)) {
            if (exceptsStarts.length) {
                updateRangeStarts(this._exceptions, exceptsStarts, next);

                const end = calcRangeOverlap(exceptsStarts, next);
                if (!! end) {
                    updateNextStarts(this._schedules, scheduleStarts, end);
                    continue;
                }
            }

            yield next;
            tickStarts(this._schedules, scheduleStarts, next);
        }
    }
}
