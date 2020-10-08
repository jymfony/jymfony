const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const Sequentially = Jymfony.Component.Validator.Constraints.Sequentially;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class SequentiallyValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    async validate(value, constraint) {
        if (! (constraint instanceof Sequentially)) {
            throw new UnexpectedTypeException(constraint, Sequentially);
        }

        const context = this._context;
        const validator = context.validator.inContext(context);

        const originalCount = validator.violations.length;

        for (const c of constraint.constraints) {
            if (originalCount !== (await validator.validate(value, c)).violations.length) {
                break;
            }
        }
    }
}
