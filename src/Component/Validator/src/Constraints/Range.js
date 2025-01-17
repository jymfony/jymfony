const Constraint = Jymfony.Component.Validator.Constraint;
const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const MissingOptionsException = Jymfony.Component.Validator.Exception.MissingOptionsException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Range extends Constraint {
    notInRangeMessage = 'This value should be between {{ min }} and {{ max }}.';
    minMessage = 'This value should be {{ limit }} or more.';
    maxMessage = 'This value should be {{ limit }} or less.';
    invalidMessage = 'This value should be a valid number.';
    min;
    minPropertyPath;
    max;
    maxPropertyPath;

    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        switch (errorCode) {
            case __self.INVALID_CHARACTERS_ERROR: return 'INVALID_CHARACTERS_ERROR';
            case __self.NOT_IN_RANGE_ERROR: return 'NOT_IN_RANGE_ERROR';
            case __self.TOO_HIGH_ERROR: return 'TOO_HIGH_ERROR';
            case __self.TOO_LOW_ERROR: return 'TOO_LOW_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        if (isObjectLiteral(options)) {
            if (undefined !== options.min && undefined !== options.minPropertyPath) {
                throw new ConstraintDefinitionException(__jymfony.sprintf('The "%s" constraint requires only one of the "min" or "minPropertyPath" options to be set, not both.', ReflectionClass.getClassName(this)));
            }

            if (undefined !== options.max && undefined !== options.maxPropertyPath) {
                throw new ConstraintDefinitionException(__jymfony.sprintf('The "%s" constraint requires only one of the "max" or "maxPropertyPath" options to be set, not both.', ReflectionClass.getClassName(this)));
            }

            if ((undefined !== options.minPropertyPath || undefined !== options.maxPropertyPath) && ! ReflectionClass.exists(Jymfony.Component.PropertyAccess.PropertyAccessor)) {
                throw new LogicException(__jymfony.sprintf('The "%s" constraint requires the Jymfony PropertyAccess component to use the "minPropertyPath" or "maxPropertyPath" option.', ReflectionClass.getClassName(this)));
            }
        }

        const ret = super.__construct(options);

        if (undefined === this.min && undefined === this.minPropertyPath && undefined === this.max && undefined === this.maxPropertyPath) {
            throw new MissingOptionsException(__jymfony.sprintf('Either option "min", "minPropertyPath", "max" or "maxPropertyPath" must be given for constraint "%s".', ReflectionClass.getClassName(this)), [ 'min', 'minPropertyPath', 'max', 'maxPropertyPath' ]);
        }

        return ret;
    }
}

Object.defineProperties(Range, {
    INVALID_CHARACTERS_ERROR: { value: 'ad9a9798-7a99-4df7-8ce9-46e416a1e60b', writable: false },
    NOT_IN_RANGE_ERROR: { value: '04b91c99-a946-4221-afc5-e65ebac401eb', writable: false },
    TOO_HIGH_ERROR: { value: '2d28afcb-e32e-45fb-a815-01c431a86a69', writable: false },
    TOO_LOW_ERROR: { value: '76454e69-502c-46c5-9643-f447d837c4d5', writable: false },
});
