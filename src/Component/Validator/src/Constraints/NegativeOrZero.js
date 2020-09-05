const LessThanOrEqual = Jymfony.Component.Validator.Constraints.LessThanOrEqual;
const NumberConstraintTrait = Jymfony.Component.Validator.Constraints.NumberConstraintTrait;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class NegativeOrZero extends mix(LessThanOrEqual, NumberConstraintTrait) {
    /**
     * @inheritdoc
     */
    __construct(options = null) {
        options = options || {};
        options.message = options.message || 'This value should be negative.';

        return super.__construct(this._configureNumberConstraintOptions(options));
    }

    /**
     * @inheritdoc
     */
    get validatedBy() {
        return 'Jymfony.Component.Validator.Constraints.LessThanOrEqualValidator';
    }
}
