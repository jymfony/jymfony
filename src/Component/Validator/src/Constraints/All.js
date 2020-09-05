const Composite = Jymfony.Component.Validator.Constraints.Composite;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class All extends Composite {
    __construct(options = null) {
        /**
         * @type {Jymfony.Component.Validator.Constraint[]}
         */
        this.constraints = [];

        return super.__construct(options);
    }

    get defaultOption() {
        return 'constraints';
    }

    get requiredOptions() {
        return [ 'constraints' ];
    }

    _getCompositeOption() {
        return 'constraints';
    }
}
