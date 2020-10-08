const GreaterThan = Jymfony.Component.Validator.Constraints.GreaterThan;
const NumberConstraintTrait = Jymfony.Component.Validator.Constraints.NumberConstraintTrait;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Positive extends mix(GreaterThan, NumberConstraintTrait) {
    /**
     * @inheritdoc
     */
    __construct(options = null) {
        options = options || {};
        options.message = options.message || 'This value should be positive.';

        return super.__construct(this._configureNumberConstraintOptions(options));
    }

    /**
     * @inheritdoc
     */
    get validatedBy() {
        return 'Jymfony.Component.Validator.Constraints.GreaterThanValidator';
    }
}
