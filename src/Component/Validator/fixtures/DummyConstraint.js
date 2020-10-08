const Constraint = Jymfony.Component.Validator.Constraint;

export default class DummyConstraint extends Constraint {
    get validatedBy() {
        return Jymfony.Component.Validator.Fixtures.DummyConstraintValidator;
    }
}

