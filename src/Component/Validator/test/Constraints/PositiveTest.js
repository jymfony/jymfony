const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const GreaterThanValidator = Jymfony.Component.Validator.Constraints.GreaterThanValidator;
const Positive = Jymfony.Component.Validator.Constraints.Positive;
const { expect } = require('chai');

describe('[Validator] Constraints.Positive', function () {
    it ('value is zero', async () => {
        const constraint = new Positive();
        expect(constraint.value).to.be.equal(0);
    });

    it ('value cannot be set', async () => {
        expect(() => new Positive({ value: 5 })).to.throw(ConstraintDefinitionException);
    });

    it ('propertyPath cannot be set', async () => {
        expect(() => new Positive({ propertyPath: 'foo' })).to.throw(ConstraintDefinitionException);
    });

    it ('should be validated by GreaterThan', async () => {
        const constraint = new Positive();
        expect(constraint.validatedBy).to.be.equal(ReflectionClass.getClassName(GreaterThanValidator));
    });
});
