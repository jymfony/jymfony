const Length = Jymfony.Component.Validator.Constraints.Length;
const InvalidArgumentException = Jymfony.Component.Validator.Exception.InvalidArgumentException;
const { expect } = require('chai');

describe('[Validator] Constraints.Length', function () {
    it ('exact is default option', async () => {
        const constraint = new Length(5);

        expect(constraint.min).to.be.equal(5);
        expect(constraint.max).to.be.equal(5);
    });

    it ('value is exact is option', async () => {
        const constraint = new Length({ value: 5, exactMessage: 'myMessage' });

        expect(constraint.min).to.be.equal(5);
        expect(constraint.max).to.be.equal(5);
        expect(constraint.exactMessage).to.be.equal('myMessage');
    });

    it ('normalizer can be set', async () => {
        const constraint = new Length({ normalizer: __jymfony.trim, min: 0, max: 10 });

        expect(constraint.normalizer).to.be.equal(__jymfony.trim);
    });

    it ('should throw trying to set invalid normalizer', async () => {
        await expect(() => new Length({ normalizer: 'foobar', min: 0, max: 10 }))
            .to.throw(InvalidArgumentException, 'The "normalizer" option must be a valid callable ("string" given).');

        expect(() => new Length({ normalizer: {}, min: 0, max: 10 }))
            .to.throw(InvalidArgumentException, 'The "normalizer" option must be a valid callable ("object" given).');
    });
});
