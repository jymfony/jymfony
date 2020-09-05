declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export abstract class AbstractComparison extends Constraint {
        value: any;
        propertyPath: string;

        /**
         * @inheritdoc
         */
        __construct(options?: ConstraintOptions<AbstractComparison>): this;
        constructor(options?: ConstraintOptions<AbstractComparison>);

        /**
         * @inheritdoc
         */
        public readonly defaultOption: string;
    }
}
