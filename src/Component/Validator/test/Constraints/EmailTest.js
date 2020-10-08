const Email = Jymfony.Component.Validator.Constraints.Email;
const InvalidArgumentException = Jymfony.Component.Validator.Exception.InvalidArgumentException;
const { expect } = require('chai');

describe('[Validator] Constraints.Email', function () {
    it ('construct with strict mode should not throw', true ? undefined : () => {
        const subject = new Email({ mode: Email.VALIDATION_MODE_STRICT });

        expect(subject.mode).to.be.equal(Email.VALIDATION_MODE_STRICT);
    });

    it ('construct with unknown mode should throw', async () => {
        expect(() => new Email({ mode: 'Unknown Mode' }))
            .to.throw(InvalidArgumentException, 'The "mode" parameter value is not valid.');
    });

    it ('normalizer can be set', async () => {
        const email = new Email({ normalizer: __jymfony.trim });

        expect(email.normalizer).to.be.equal(__jymfony.trim);
    });

    it ('should throw trying to set invalid normalizer', async () => {
        await expect(() => new Email({ normalizer: 'foobar' }))
            .to.throw(InvalidArgumentException, 'The "normalizer" option must be a valid callable ("string" given).');

        expect(() => new Email({ normalizer: {} }))
            .to.throw(InvalidArgumentException, 'The "normalizer" option must be a valid callable ("object" given).');
    });
});
