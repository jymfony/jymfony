declare namespace Jymfony.Component.Validator.Constraints {
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
    import Iban = Jymfony.Component.Validator.Constraints.Iban;

    export class IbanValidator extends ConstraintValidator {
        /**
         * @inheritdoc
         */
        validate(value: any, constraint: Iban): void;
        static _toBigInt(string: string): bigint;
    }
}
