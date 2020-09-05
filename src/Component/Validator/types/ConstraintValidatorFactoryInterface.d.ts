declare namespace Jymfony.Component.Validator {
    /**
     * Specifies an object able to return the correct ConstraintValidatorInterface
     * instance given a Constraint object.
     */
    export class ConstraintValidatorFactoryInterface {
        public static readonly definition: Newable<ConstraintValidatorFactoryInterface>;

        /**
         * Given a Constraint, this returns the ConstraintValidatorInterface
         * object that should be used to verify its validity.
         */
        getInstance(constraint: Constraint): ConstraintValidatorInterface;
    }
}
