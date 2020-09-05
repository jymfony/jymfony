declare namespace Jymfony.Component.Validator.Constraints {
    import GreaterThanOrEqual = Jymfony.Component.Validator.Constraints.GreaterThanOrEqual;
    import NumberConstraintTrait = Jymfony.Component.Validator.Constraints.NumberConstraintTrait;

    export class PositiveOrZero extends mix(GreaterThanOrEqual, NumberConstraintTrait) {
        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<PositiveOrZero>): this;
        constructor(options?: null | ConstraintOptions<PositiveOrZero>);

        /**
         * @inheritdoc
         */
        public readonly validatedBy: string;
    }
}
