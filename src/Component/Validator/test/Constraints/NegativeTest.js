const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const LessThanValidator = Jymfony.Component.Validator.Constraints.LessThanValidator;
const Negative = Jymfony.Component.Validator.Constraints.Negative;
const { expect } = require('chai');

describe('[Validator] Constraints.Negative', function () {
    it ('value is zero', async () => {
        const constraint = new Negative();
        expect(constraint.value).to.be.equal(0);
    });

    it ('value cannot be set', async () => {
        expect(() => new Negative({ value: 5 })).to.throw(ConstraintDefinitionException);
    });

    it ('propertyPath cannot be set', async () => {
        expect(() => new Negative({ propertyPath: 'foo' })).to.throw(ConstraintDefinitionException);
    });

    it ('should be validated by LessThan', async () => {
        const constraint = new Negative();
        expect(constraint.validatedBy).to.be.equal(ReflectionClass.getClassName(LessThanValidator));
    });
});
