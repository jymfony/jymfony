const AbstractComparison = Jymfony.Component.Validator.Constraints.AbstractComparison;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class DivisibleBy extends AbstractComparison {
    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        switch (errorCode) {
            case __self.NOT_DIVISIBLE_BY: return 'NOT_DIVISIBLE_BY';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        this.message = 'This value should be a multiple of {{ compared_value }}.';

        return super.__construct(options);
    }
}

Object.defineProperty(DivisibleBy, 'NOT_DIVISIBLE_BY', { writable: false, value: '6d99d6c3-1464-4ccf-bdc7-14d083cf455c' });
