const Collection = Jymfony.Component.Validator.Constraints.Collection;
const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const Optional = Jymfony.Component.Validator.Constraints.Optional;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;
const UnexpectedValueException = Jymfony.Component.Validator.Exception.UnexpectedValueException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class CollectionValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    async validate(value, constraint) {
        if (! (constraint instanceof Collection)) {
            throw new UnexpectedTypeException(constraint, Collection);
        }

        if (null === value || undefined === value) {
            return;
        }

        if (! isObjectLiteral(value) && ! (value instanceof Map)) {
            throw new UnexpectedValueException(value, 'Object or Map');
        }

        /*
         * We need to keep the initialized context when CollectionValidator
         * calls itself recursively (Collection constraints can be nested).
         *
         * Since the context of the validator is overwritten when initialize()
         * is called for the nested constraint, the outer validator is
         * acting on the wrong context when the nested validation terminates.
         *
         * A better solution - which should be approached in Symfony 3.0 - is to
         * remove the initialize() method and pass the context as last argument
         * to validate() instead.
         */
        const context = this._context;
        const exists = value instanceof Map ? (f => value.has(f)) : (f => Object.prototype.hasOwnProperty.call(value, f));
        const accessor = value instanceof Map ? (f => value.get(f)) : (f => value[f]);

        for (const [ field, fieldConstraint ] of __jymfony.getEntries(constraint.fields)) {
            if (exists(field)) {
                if (0 < fieldConstraint.constraints.length) {
                    await context.validator
                        .inContext(context)
                        .atPath(field)
                        .validate(accessor(field), fieldConstraint.constraints);
                }
            } else if (! (fieldConstraint instanceof Optional) && ! constraint.allowMissingFields) {
                context.buildViolation(constraint.missingFieldsMessage)
                    .atPath(field)
                    .setParameter('{{ field }}', this._formatValue(field))
                    .setInvalidValue(undefined)
                    .setCode(Collection.MISSING_FIELD_ERROR)
                    .addViolation();
            }
        }

        if (! constraint.allowExtraFields) {
            for (const [ field, fieldValue ] of __jymfony.getEntries(value)) {
                if (undefined === constraint.fields[field]) {
                    context.buildViolation(constraint.extraFieldsMessage)
                        .atPath(field)
                        .setParameter('{{ field }}', this._formatValue(field))
                        .setInvalidValue(fieldValue)
                        .setCode(Collection.NO_SUCH_FIELD_ERROR)
                        .addViolation();
                }
            }
        }
    }
}
