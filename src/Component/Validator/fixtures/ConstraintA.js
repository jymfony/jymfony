const Constraint = Jymfony.Component.Validator.Constraint;

export default class ConstraintA extends Constraint {
    __construct(options = null) {
        this.property1 = undefined;
        this.property2 = undefined;
        return super.__construct(options);
    }

    get defaultOption() {
        return 'property2';
    }

    get targets() {
        return [ __self.PROPERTY_CONSTRAINT, __self.CLASS_CONSTRAINT ];
    }
}
