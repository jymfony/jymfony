const Constraint = Jymfony.Component.Validator.Constraint;

export default class ConstraintC extends Constraint {
    option1;

    get requiredOptions() {
        return [ 'option1' ];
    }

    get targets() {
        return [ __self.PROPERTY_CONSTRAINT, __self.CLASS_CONSTRAINT ];
    }
}
