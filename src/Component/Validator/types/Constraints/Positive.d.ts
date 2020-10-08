declare namespace Jymfony.Component.Validator.Constraints {
    import GreaterThan = Jymfony.Component.Validator.Constraints.GreaterThan;
    import NumberConstraintTrait = Jymfony.Component.Validator.Constraints.NumberConstraintTrait;

    export class Positive extends mix(GreaterThan, NumberConstraintTrait) {
        /**
         * @inheritdoc
         */
        __construct(options?: ConstraintOptions<Positive>): this;
        constructor(options?: ConstraintOptions<Positive>);

        /**
         * @inheritdoc
         */
        public readonly validatedBy: string;
    }
}
