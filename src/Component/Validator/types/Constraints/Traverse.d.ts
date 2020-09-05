declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class Traverse extends Constraint {
        public traverse: boolean;

        __construct(options?: null | ConstraintOptions<Traverse>): this;
        constructor(options?: null | ConstraintOptions<Traverse>);

        /**
         * @inheritdoc
         */
        public readonly defaultOption: string;

        /**
         * @inheritdoc
         */
        public readonly targets: string;
    }
}
