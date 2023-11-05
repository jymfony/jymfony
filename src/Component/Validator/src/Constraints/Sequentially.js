const Composite = Jymfony.Component.Validator.Constraints.Composite;

/**
 * Use this constraint to sequentially validate nested constraints.
 * Validation for the nested constraints collection will stop at first violation.
 *
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Sequentially extends Composite {
    constraints = [];

    /**
     * @inheritdoc
     */
    get defaultOption() {
        return 'constraints';
    }

    /**
     * @inheritdoc
     */
    get requiredOptions() {
        return [ 'constraints' ];
    }

    /**
     * @inheritdoc
     */
    get targets() {
        return [ __self.CLASS_CONSTRAINT, __self.PROPERTY_CONSTRAINT ];
    }

    /**
     * @inheritdoc
     */
    _getCompositeOption() {
        return 'constraints';
    }
}
