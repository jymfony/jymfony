const Count = Jymfony.Component.Validator.Constraints.Count;
const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const DivisibleBy = Jymfony.Component.Validator.Constraints.DivisibleBy;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;
const UnexpectedValueException = Jymfony.Component.Validator.Exception.UnexpectedValueException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class CountValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    async validate(value, constraint) {
        if (! (constraint instanceof Count)) {
            throw new UnexpectedTypeException(constraint, Count);
        }

        if (undefined === value || null === value) {
            return;
        }

        const count = value instanceof Set || value instanceof Map
            ? value.size
            : isObjectLiteral(value) ? Object.keys(value).length : await value.length;

        if (undefined === count) {
            throw new UnexpectedValueException(value, 'countable');
        }

        if (undefined !== constraint.max && count > constraint.max) {
            this._context.buildViolation(constraint.min == constraint.max ? constraint.exactMessage : constraint.maxMessage)
                .setParameter('{{ count }}', count)
                .setParameter('{{ limit }}', constraint.max)
                .setInvalidValue(value)
                .setPlural(~~constraint.max)
                .setCode(Count.TOO_MANY_ERROR)
                .addViolation();

            return;
        }

        if (undefined !== constraint.min && count < constraint.min) {
            this._context.buildViolation(constraint.min == constraint.max ? constraint.exactMessage : constraint.minMessage)
                .setParameter('{{ count }}', count)
                .setParameter('{{ limit }}', constraint.min)
                .setInvalidValue(value)
                .setPlural(~~constraint.min)
                .setCode(Count.TOO_FEW_ERROR)
                .addViolation();

            return;
        }

        if (undefined !== constraint.divisibleBy) {
            await this._context
                .validator
                .inContext(this._context)
                .validate(count, [
                    new DivisibleBy({
                        value: constraint.divisibleBy,
                        message: constraint.divisibleByMessage,
                    }),
                ], this._context.group);
        }
    }
}
