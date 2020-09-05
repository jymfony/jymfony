const Email = Jymfony.Component.Validator.Constraints.Email;
const ValidationFailedException = Jymfony.Component.Validator.Exception.ValidationFailedException;
const Validation = Jymfony.Component.Validator.Validation;
const { expect } = require('chai');

describe('[Validator] Validation', function () {
    it ('createCallable should work', async () => {
        const validator = Validation.createCallable(new Email());
        expect(await validator('text@example.com')).to.be.equal('text@example.com');
    });

    it ('createCallable should throw on invalid value', async () => {
        const validator = Validation.createCallable(new Email());
        try {
            await validator('test');
            throw new Error('FAIL');
        } catch (e) {
            expect(e).to.be.instanceOf(ValidationFailedException);
        }
    });
});
