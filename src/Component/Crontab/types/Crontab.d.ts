declare namespace Jymfony.Component.Crontab {
    import DateTime = Jymfony.Component.DateTime.DateTime;
    import CompiledSchedule = Jymfony.Component.Crontab.Compiler.CompiledSchedule;

    /**
     * @memberOf Jymfony.Component.Crontab
     */
    export class Crontab implements Iterable<DateTime> {
        private _schedules: CompiledSchedule[];
        private _exceptions: CompiledSchedule[];
        private _currentDate: DateTime;

        /**
         * Constructor.
         */
        __construct(schedule: ScheduleSet, currentDate: DateTime): void;
        constructor(schedule: ScheduleSet, currentDate: DateTime);

        [Symbol.iterator](): IterableIterator<DateTime>;
    }
}
