const Callback = Jymfony.Component.Validator.Constraints.Callback;
const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

/**
 * Validator for Callback constraint.
 *
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class CallbackValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    async validate(object, constraint) {
        if (! (constraint instanceof Callback)) {
            throw new UnexpectedTypeException(constraint, Callback);
        }

        const method = constraint.callback;
        if (isFunction(method)) {
            await method.call(null, object, this._context, constraint.payload);
        } else if (isArray(method)) {
            if (! isCallableArray(method)) {
                if (undefined !== method[0] && isObject(method[0])) {
                    method[0] = ReflectionClass.getClassName(method[0]);
                }

                throw new ConstraintDefinitionException(__jymfony.sprintf('%s targeted by Callback constraint is not a valid callable', JSON.stringify(method)));
            }

            await getCallableFromArray(method).call(object, this._context, constraint.payload);
        } else if (null !== object) {
            const reflClass = new ReflectionClass(object);
            if (! reflClass.hasMethod(method)) {
                throw new ConstraintDefinitionException(__jymfony.sprintf('Method "%s" targeted by Callback constraint does not exist in class %s', method, reflClass.name));
            }

            const reflMethod = reflClass.getMethod(method);
            if (reflMethod.isStatic) {
                await (reflMethod.method)(object, this._context, constraint.payload);
            } else {
                await reflMethod.method.call(object, this._context, constraint.payload);
            }
        }
    }
}
