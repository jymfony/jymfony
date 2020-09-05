declare namespace Jymfony.Component.Crontab.Constraints {
    import DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;

    export class Day extends implementationOf(ConstraintInterface, PeriodInterface) {
        public readonly range: number;

        /**
         * @inheritdoc
         */
        val(d: DateTimeInterface): number;

        /**
         * @inheritdoc
         */
        isValid(d: DateTimeInterface, val: number): boolean;

        /**
         * @inheritdoc
         */
        extent(d: DateTimeInterface): [number, number];

        /**
         * @inheritdoc
         */
        start(d: DateTimeInterface): DateTimeInterface;

        /**
         * @inheritdoc
         */
        end(d: DateTimeInterface): DateTimeInterface;

        /**
         * @inheritdoc
         */
        next(d: DateTimeInterface, val: number): DateTimeInterface;

        private _nextRollover(d: DateTimeInterface, val: number): DateTimeInterface;
    }
}
