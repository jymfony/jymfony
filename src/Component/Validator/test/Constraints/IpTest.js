const Ip = Jymfony.Component.Validator.Constraints.Ip;
const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const InvalidArgumentException = Jymfony.Component.Validator.Exception.InvalidArgumentException;
const { expect } = require('chai');

describe('[Validator] Constraints.Ip', function () {
    it ('normalizer can be set', () => {
        const subject = new Ip({ normalizer: __jymfony.trim });
        expect(subject.normalizer).to.be.equal(__jymfony.trim);
    });

    it ('invalid normalizer should throw', () => {
        expect(() => new Ip({ normalizer: 'Unknown Normalizer' }))
            .to.throw(InvalidArgumentException, 'The "normalizer" option must be a valid callable ("string" given).');
    });

    it ('invalid normalizer object should throw', () => {
        expect(() => new Ip({ normalizer: new Object() }))
            .to.throw(InvalidArgumentException, 'The "normalizer" option must be a valid callable ("object" given).');
    });

    it ('invalid version should throw', () => {
        expect(() => new Ip({ version: 666 }))
            .to.throw(ConstraintDefinitionException);
    });
});
