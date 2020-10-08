const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const Type = Jymfony.Component.Validator.Constraints.Type;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

const VALIDATION_FUNCTIONS = {
    'bool': isBoolean,
    'boolean': isBoolean,
    'int': Number.isInteger,
    'integer': Number.isInteger,
    'long': Number.isInteger,
    'float': isNumber,
    'double': isNumber,
    'real': isNumber,
    'number': isNumber,
    'numeric': isNumeric,
    'string': isString,
    'scalar': isScalar,
    'array': isArray,
    'function': isFunction,
    'object': isObjectLiteral,
    'null': val => null === val,
    'undefined': val => undefined === val,
};

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class TypeValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    async validate(value, constraint) {
        if (! (constraint instanceof Type)) {
            throw new UnexpectedTypeException(constraint, Type);
        }

        if (null === value || undefined === value) {
            return;
        }

        const types = isArray(constraint.type) ? constraint.type : [ constraint.type ];
        for (let type of types) {
            if (isString(type)) {
                const strType = type.toLowerCase();
                if (undefined !== VALIDATION_FUNCTIONS[strType] && VALIDATION_FUNCTIONS[strType](value)) {
                    return;
                }
            }

            type = ReflectionClass.exists(type) ? ReflectionClass.getClass(type) : type;
            if (isFunction(type) && value instanceof type) {
                return;
            }
        }

        this._context.buildViolation(constraint.message)
            .setParameter('{{ value }}', this._formatValue(value))
            .setParameter('{{ type }}', types.join('|'))
            .setCode(Type.INVALID_TYPE_ERROR)
            .addViolation();
    }
}
