declare namespace Jymfony.Component.Crontab.Constraints {
    import DateTime = Jymfony.Component.DateTime.DateTime;

    export class Month extends implementationOf(ConstraintInterface, PeriodInterface) {
        public readonly range: number;

        /**
         * @inheritdoc
         */
        val(d: DateTime): number;

        /**
         * @inheritdoc
         */
        isValid(d: DateTime, val: number): boolean;

        /**
         * @inheritdoc
         */
        extent(d: DateTime): [number, number];

        /**
         * @inheritdoc
         */
        start(d: DateTime): DateTime;

        /**
         * @inheritdoc
         */
        end(d: DateTime): DateTime;

        /**
         * @inheritdoc
         */
        next(d: DateTime, val: number): DateTime;
    }
}
