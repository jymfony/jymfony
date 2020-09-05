declare namespace Jymfony.Component.Validator.Constraints {
    import LessThanOrEqual = Jymfony.Component.Validator.Constraints.LessThanOrEqual;
    import NumberConstraintTrait = Jymfony.Component.Validator.Constraints.NumberConstraintTrait;

    export class NegativeOrZero extends mix(LessThanOrEqual, NumberConstraintTrait) {
        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<NegativeOrZero>): this;

        /**
         * @inheritdoc
         */
        public readonly validatedBy: string;
    }
}
