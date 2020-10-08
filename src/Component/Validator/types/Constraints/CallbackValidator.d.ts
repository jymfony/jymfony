declare namespace Jymfony.Component.Validator.Constraints {
    import Callback = Jymfony.Component.Validator.Constraints.Callback;

    /**
     * Validator for Callback constraint.
     */
    export class CallbackValidator extends ConstraintValidator {
        /**
         * @inheritdoc
         */
        validate(object: any, constraint: Callback): Promise<void>;
    }
}
