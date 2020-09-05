declare namespace Jymfony.Component.Validator.Constraints {
    import Composite = Jymfony.Component.Validator.Constraints.Composite;

    export class All extends Composite {
        constraints: Constraint[];

        __construct(options?: null | ConstraintOptions<All>): this;
        constructor(options?: null | ConstraintOptions<All>);

        public readonly defaultOption: string;
        public readonly requiredOptions: string[];
        protected _getCompositeOption(): string;
    }
}
