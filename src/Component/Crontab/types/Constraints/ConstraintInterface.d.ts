declare namespace Jymfony.Component.Crontab.Constraints {
    import DateTime = Jymfony.Component.DateTime.DateTime;

    export class ConstraintInterface implements MixinInterface {
        public static readonly definition: Newable<ConstraintInterface>;

        /**
         * Gets the constraint range (needed to order constraints).
         */
        get range(): number;

        /**
         * Gets the value for this constraint.
         */
        val(d: DateTime): number;

        /**
         * Checks if the value is valid for the given date time.
         */
        isValid(d: DateTime, val: number): boolean;

        /**
         * The minimum and maximum valid day values of the month specified.
         * Zero to specify the last day of the month.
         *
         * @param d The date indicating the month to find the extent of
         */
        extent(d: DateTime): [number, number];
    }
}
