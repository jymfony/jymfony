const Constraint = Jymfony.Component.Validator.Constraint;

export default class FailingConstraint extends Constraint {
    message = 'Failed';

    get targets() {
        return [ __self.PROPERTY_CONSTRAINT, __self.CLASS_CONSTRAINT ];
    }
}
