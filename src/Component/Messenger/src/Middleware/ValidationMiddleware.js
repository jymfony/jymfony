const MiddlewareInterface = Jymfony.Component.Messenger.Middleware.MiddlewareInterface;
const ValidationFailedException = Jymfony.Component.Messenger.Exception.ValidationFailedException;
const ValidationStamp = Jymfony.Component.Messenger.Stamp.ValidationStamp;

/**
 * @memberOf Jymfony.Component.Messenger.Middleware
 */
export default class ValidationMiddleware extends implementationOf(MiddlewareInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Validator.Validator.ValidatorInterface} validator
     */
    __construct(validator) {
        /**
         * @type {Jymfony.Component.Validator.Validator.ValidatorInterface}
         *
         * @private
         */
        this._validator = validator;
    }

    /**
     * @inheritdoc
     */
    async handle(envelope, stack) {
        const { message } = envelope;
        let groups = null;

        /** @type {Jymfony.Component.Messenger.Stamp.ValidationStamp | null} validationStamp */
        const validationStamp = envelope.last(ValidationStamp);
        if (null !== validationStamp) {
            groups = validationStamp.groups;
        }

        const violations = await this._validator.validate(message, null, groups);
        if (0 < violations.length) {
            throw new ValidationFailedException(message, violations);
        }

        return stack.next().handle(envelope, stack);
    }
}
