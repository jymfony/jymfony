declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class Valid extends Constraint {
        public traverse: boolean;

        __construct(options?: null | ConstraintOptions<Valid>): this;
        constructor(options?: null | ConstraintOptions<Valid>);

        public groups: null | string[];

        addImplicitGroupName(group: string): void;
    }
}
