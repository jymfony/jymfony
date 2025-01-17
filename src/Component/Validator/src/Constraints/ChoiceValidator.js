const Choice = Jymfony.Component.Validator.Constraints.Choice;
const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

/**
 * Validates that a card number belongs to a specified scheme.
 *
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class ChoiceValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    validate(value, constraint) {
        if (! (constraint instanceof Choice)) {
            throw new UnexpectedTypeException(constraint, Choice);
        }

        if (! isArray(constraint.choices) && ! constraint.callback) {
            throw new ConstraintDefinitionException('Either "choices" or "callback" must be specified on constraint Choice');
        }

        if (null === value || undefined === value) {
            return;
        }

        if (constraint.multiple && ! isArray(value)) {
            throw new UnexpectedTypeException(value, 'Array');
        }

        let choices;
        if (constraint.callback) {
            if (isCallableArray(constraint.callback)) {
                choices = getCallableFromArray(constraint.callback);
            } else if (isFunction(constraint.callback)) {
                choices = constraint.callback;
            } else {
                try {
                    const reflClass = new ReflectionClass(this._context.object);
                    const method = reflClass.getMethod(constraint.callback);
                    choices = method.method;
                } catch {
                    // Do nothing.
                }
            }

            if (! isFunction(choices)) {
                throw new ConstraintDefinitionException('The Choice constraint expects a valid callback');
            }

            choices = choices();
        } else {
            choices = constraint.choices;
        }

        if (constraint.multiple) {
            for (const _value of value) {
                if (! choices.includes(_value)) {
                    this._context.buildViolation(constraint.multipleMessage)
                        .setParameter('{{ value }}', this._formatValue(_value))
                        .setCode(Choice.NO_SUCH_CHOICE_ERROR)
                        .setInvalidValue(_value)
                        .addViolation();

                    return;
                }
            }

            const count = value.length;

            if (undefined !== constraint.min && null !== constraint.min && count < constraint.min) {
                this._context.buildViolation(constraint.minMessage)
                    .setParameter('{{ limit }}', constraint.min)
                    .setPlural(~~constraint.min)
                    .setCode(Choice.TOO_FEW_ERROR)
                    .addViolation();

                return;
            }

            if (undefined !== constraint.max && null !== constraint.max && count > constraint.max) {
                this._context.buildViolation(constraint.maxMessage)
                    .setParameter('{{ limit }}', constraint.max)
                    .setPlural(~~constraint.max)
                    .setCode(Choice.TOO_MANY_ERROR)
                    .addViolation();
            }
        } else if (! choices.includes(value)) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setParameter('{{ choices }}', this._formatValues(choices))
                .setCode(Choice.NO_SUCH_CHOICE_ERROR)
                .addViolation();
        }
    }
}
