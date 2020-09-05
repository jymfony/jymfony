const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const Unique = Jymfony.Component.Validator.Constraints.Unique;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;
const UnexpectedValueException = Jymfony.Component.Validator.Exception.UnexpectedValueException;

const includes = (collection, value) => {
    if (isArray(value)) {
        for (const element of collection) {
            if (__jymfony.equal(value, element)) {
                return true;
            }
        }

        return false;
    }

    return collection.includes(value);
};

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class UniqueValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    validate(value, constraint) {
        if (! (constraint instanceof Unique)) {
            throw new UnexpectedTypeException(constraint, Unique);
        }

        if (null === value || undefined === value) {
            return;
        }

        if (! isArray(value) && ! isObjectLiteral(value) && (! isObject(value) || ! Symbol.iterator in value)) {
            throw new UnexpectedValueException(value, 'array|object|IterableIterator');
        }

        const collectionElements = [];
        for (const [ , element ] of __jymfony.getEntries(value)) {
            if (includes(collectionElements, element)) {
                this._context.buildViolation(constraint.message)
                    .setParameter('{{ value }}', this._formatValue(element))
                    .setCode(Unique.IS_NOT_UNIQUE)
                    .addViolation();

                return;
            }

            collectionElements.push(element);
        }
    }
}
