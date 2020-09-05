declare namespace Jymfony.Component.Validator.Constraints {
    import Composite = Jymfony.Component.Validator.Constraints.Composite;
    import Constraint = Jymfony.Component.Validator.Constraint;

    /**
     * Use this constraint to sequentially validate nested constraints.
     * Validation for the nested constraints collection will stop at first violation.
     */
    export class Sequentially extends Composite {
        public constraints: Constraint[];

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<Sequentially>): this;
        constructor(options?: null | ConstraintOptions<Sequentially>);

        /**
         * @inheritdoc
         */
        public readonly defaultOption: string;

        /**
         * @inheritdoc
         */
        public readonly requiredOptions: string[];

        /**
         * @inheritdoc
         */
        public readonly targets: string[];

        /**
         * @inheritdoc
         */
        protected _getCompositeOption(): string;
    }
}
