declare namespace Jymfony.Component.Validator.Constraints {
    import LessThan = Jymfony.Component.Validator.Constraints.LessThan;
    import NumberConstraintTrait = Jymfony.Component.Validator.Constraints.NumberConstraintTrait;

    export class Negative extends mix(LessThan, NumberConstraintTrait) {
        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<Negative>): this;

        /**
         * @inheritdoc
         */
        public readonly validatedBy: string;
    }
}
