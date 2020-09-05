declare namespace Jymfony.Component.Crontab {
    import DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;
    import CompiledSchedule = Jymfony.Component.Crontab.Compiler.CompiledSchedule;

    /**
     * @memberOf Jymfony.Component.Crontab
     */
    export class Crontab implements Iterable<DateTimeInterface> {
        private _schedules: CompiledSchedule[];
        private _exceptions: CompiledSchedule[];
        private _currentDate: DateTimeInterface;

        /**
         * Constructor.
         */
        __construct(schedule: ScheduleSet, currentDate: DateTimeInterface): void;
        constructor(schedule: ScheduleSet, currentDate: DateTimeInterface);

        [Symbol.iterator](): IterableIterator<DateTimeInterface>;
    }
}
