const All = Jymfony.Component.Validator.Constraints.All;
const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;
const UnexpectedValueException = Jymfony.Component.Validator.Exception.UnexpectedValueException;

const iterable = v => isArray(v) || isObjectLiteral(v) || v instanceof Set || v instanceof Map;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class AllValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    async validate(value, constraint) {
        if (! (constraint instanceof All)) {
            throw new UnexpectedTypeException(constraint, All);
        }

        if (null === value || undefined === value) {
            return;
        }

        if (! iterable(value)) {
            if (undefined !== value[Symbol.iterator]) {
                value = [ ...value ];
            } else {
                throw new UnexpectedValueException(value, 'array');
            }
        }

        const context = this._context;
        const validator = context.validator.inContext(context);

        for (const [ key, element ] of __jymfony.getEntries(value)) {
            await validator.atPath('[' + key + ']').validate(element, constraint.constraints);
        }
    }
}
