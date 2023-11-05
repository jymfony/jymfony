const Constraint = Jymfony.Component.Validator.Constraint;
const DivisibleBy = Jymfony.Component.Validator.Constraints.DivisibleBy;
const MissingOptionsException = Jymfony.Component.Validator.Exception.MissingOptionsException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Count extends Constraint {
    minMessage = 'This collection should contain {{ limit }} element or more.|This collection should contain {{ limit }} elements or more.';
    maxMessage = 'This collection should contain {{ limit }} element or less.|This collection should contain {{ limit }} elements or less.';
    exactMessage = 'This collection should contain exactly {{ limit }} element.|This collection should contain exactly {{ limit }} elements.';
    divisibleByMessage = 'The number of elements in this collection should be a multiple of {{ compared_value }}.';
    min;
    max;
    divisibleBy;

    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        switch (errorCode) {
            case __self.TOO_FEW_ERROR: return 'TOO_FEW_ERROR';
            case __self.TOO_MANY_ERROR: return 'TOO_MANY_ERROR';
            case __self.NOT_DIVISIBLE_BY_ERROR: return 'NOT_DIVISIBLE_BY_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    __construct(options = null) {
        if (null !== options && ! isObjectLiteral(options)) {
            options = {
                min: options,
                max: options,
            };
        } else if (isObjectLiteral(options) && undefined !== options.value && undefined === options.min && undefined === options.max) {
            options.min = options.max = options.value;
            delete options.value;
        }

        const ret = super.__construct(options);
        if (undefined === this.min && undefined === this.max && undefined === this.divisibleBy) {
            throw new MissingOptionsException(__jymfony.sprintf('Either option "min", "max" or "divisibleBy" must be given for constraint "%s".', __jymfony.get_debug_type(this)), [ 'min', 'max', 'divisibleBy' ]);
        }

        return ret;
    }
}

Object.defineProperties(Count, {
    TOO_FEW_ERROR: { writable: false, value: 'bef8e338-6ae5-4caf-b8e2-50e7b0579e69' },
    TOO_MANY_ERROR: { writable: false, value: '756b1212-697c-468d-a9ad-50dd783bb169' },
    NOT_DIVISIBLE_BY_ERROR: { writable: false, value: DivisibleBy.NOT_DIVISIBLE_BY },
});
