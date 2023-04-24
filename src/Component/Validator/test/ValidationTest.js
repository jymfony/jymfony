const Email = Jymfony.Component.Validator.Constraints.Email;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const ValidationFailedException = Jymfony.Component.Validator.Exception.ValidationFailedException;
const Validation = Jymfony.Component.Validator.Validation;

export default class ValidationTest extends TestCase {
    get testCaseName() {
        return '[Validator] ' + super.testCaseName;
    }

    async testCreateCallableShouldWork() {
        const validator = Validation.createCallable(new Email());
        __self.assertEquals('test@example.org', await validator('test@example.org'));
    }

    async testCreateCallableShouldThrowOnInvalidValue() {
        const validator = Validation.createCallable(new Email());
        this.expectException(ValidationFailedException);
        await validator('test');
    }
}
