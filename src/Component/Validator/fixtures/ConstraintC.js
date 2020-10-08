const Constraint = Jymfony.Component.Validator.Constraint;

export default class ConstraintC extends Constraint {
    __construct(options = null) {
        this.option1 = undefined;
        return super.__construct(options);
    }

    get requiredOptions() {
        return [ 'option1' ];
    }

    get targets() {
        return [ __self.PROPERTY_CONSTRAINT, __self.CLASS_CONSTRAINT ];
    }
}
