declare namespace Jymfony.Component.Validator.Constraints {
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
    import Isin = Jymfony.Component.Validator.Constraints.Isin;

    export class IsinValidator extends ConstraintValidator {
        /**
         * @inheritdoc
         */
        validate(value: any, constraint: Isin): Promise<void>;

        /**
         * Checks value for checksum correctness.
         */
        private _isCorrectChecksum(input: string): Promise<boolean>;
    }
}
