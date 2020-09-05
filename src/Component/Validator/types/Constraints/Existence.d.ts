declare namespace Jymfony.Component.Validator.Constraints {
    import Composite = Jymfony.Component.Validator.Constraints.Composite;

    export abstract class Existence extends Composite {
        constraints: Constraint[];

        __construct(options?: null | ConstraintOptions<Existence>): this;
        constructor(options?: null | ConstraintOptions<Existence>);

        public readonly defaultOption: string;
        protected _getCompositeOption(): string;
    }
}
