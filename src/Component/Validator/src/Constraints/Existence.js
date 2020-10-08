const Composite = Jymfony.Component.Validator.Constraints.Composite;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 * @abstract
 */
export default class Existence extends Composite {
    __construct(options = null) {
        this.constraints = [];

        return super.__construct(options);
    }

    get defaultOption() {
        return 'constraints';
    }

    _getCompositeOption() {
        return 'constraints';
    }
}
