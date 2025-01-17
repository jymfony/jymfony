const Constraint = Jymfony.Component.Validator.Constraint;

export default class ConstraintA extends Constraint {
    property1;
    property2;

    get defaultOption() {
        return 'property2';
    }

    get targets() {
        return [ __self.PROPERTY_CONSTRAINT, __self.CLASS_CONSTRAINT ];
    }
}
