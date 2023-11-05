const Composite = Jymfony.Component.Validator.Constraints.Composite;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 * @abstract
 */
export default class Existence extends Composite {
    constraints = [];

    get defaultOption() {
        return 'constraints';
    }

    _getCompositeOption() {
        return 'constraints';
    }
}
