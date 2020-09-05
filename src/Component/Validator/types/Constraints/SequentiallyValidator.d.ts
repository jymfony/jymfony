declare namespace Jymfony.Component.Validator.Constraints {
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
    import Sequentially = Jymfony.Component.Validator.Constraints.Sequentially;

    export class SequentiallyValidator extends ConstraintValidator {
        /**
         * @inheritdoc
         */
        validate(value: any, constraint: Sequentially): Promise<void>;
    }
}
