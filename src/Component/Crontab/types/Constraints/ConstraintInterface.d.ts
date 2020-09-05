declare namespace Jymfony.Component.Crontab.Constraints {
    import DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;

    export class ConstraintInterface {
        public static readonly definition: Newable<ConstraintInterface>;

        /**
         * Gets the constraint range (needed to order constraints).
         */
        get range(): number;

        /**
         * Gets the value for this constraint.
         */
        val(d: DateTimeInterface): number;

        /**
         * Checks if the value is valid for the given date time.
         */
        isValid(d: DateTimeInterface, val: number): boolean;

        /**
         * The minimum and maximum valid day values of the month specified.
         * Zero to specify the last day of the month.
         *
         * @param d The date indicating the month to find the extent of
         */
        extent(d: DateTimeInterface): [number, number];
    }
}
