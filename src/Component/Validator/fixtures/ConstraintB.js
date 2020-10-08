const Constraint = Jymfony.Component.Validator.Constraint;

export default class ConstraintB extends Constraint {
    get targets() {
        return [ __self.PROPERTY_CONSTRAINT, __self.CLASS_CONSTRAINT ];
    }
}
