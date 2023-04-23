const Envelope = Jymfony.Component.Messenger.Envelope;
const ValidationFailedException = Jymfony.Component.Messenger.Exception.ValidationFailedException;
const ValidationMiddleware = Jymfony.Component.Messenger.Middleware.ValidationMiddleware;
const ValidationStamp = Jymfony.Component.Messenger.Stamp.ValidationStamp;
const MiddlewareTestCase = Jymfony.Component.Messenger.Test.MiddlewareTestCase;
const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const ConstraintViolationListInterface = Jymfony.Component.Validator.ConstraintViolationListInterface;
const ValidatorInterface = Jymfony.Component.Validator.Validator.ValidatorInterface;

export default class ValidationMiddlewareTest extends MiddlewareTestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    async testValidateAndNextMiddleware() {
        const message = new DummyMessage('Hey');
        const envelope = new Envelope(message);

        const validator = this.prophesize(ValidatorInterface);
        validator.validate(message, null, null)
            .shouldBeCalledTimes(1)
            .willReturn(this.prophesize(ConstraintViolationListInterface));

        await (new ValidationMiddleware(validator.reveal())).handle(envelope, this._getStackMock());
    }

    async testValidateWithStampAndNextMiddleware() {
        const message = new DummyMessage('Hey');
        const groups = [ 'Default', 'Extra' ];
        const envelope = (new Envelope(message)).withStamps(new ValidationStamp(groups));

        const validator = this.prophesize(ValidatorInterface);
        validator.validate(message, null, groups)
            .shouldBeCalledTimes(1)
            .willReturn(this.prophesize(ConstraintViolationListInterface));
        ;

        await (new ValidationMiddleware(validator.reveal())).handle(envelope, this._getStackMock());
    }

    async testValidationFailedException() {
        this.expectException(ValidationFailedException);
        this.expectExceptionMessage('Message of type "Jymfony.Component.Messenger.Fixtures.DummyMessage" failed validation.');

        const message = new DummyMessage('Hey');
        const envelope = new Envelope(message);

        const violationList = this.prophesize(ConstraintViolationListInterface);
        violationList.length().willReturn(1);

        const validator = this.prophesize(ValidatorInterface);
        validator.validate(message, null, null)
            .shouldBeCalledTimes(1)
            .willReturn(violationList);

        await (new ValidationMiddleware(validator.reveal())).handle(envelope, this._getStackMock(false));
    }
}
