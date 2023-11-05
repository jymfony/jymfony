const Composite = Jymfony.Component.Validator.Constraints.Composite;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class All extends Composite {
    /**
     * @type {Jymfony.Component.Validator.Constraint[]}
     */
    constraints = [];

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
