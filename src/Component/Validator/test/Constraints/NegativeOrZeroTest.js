const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const LessThanOrEqualValidator = Jymfony.Component.Validator.Constraints.LessThanOrEqualValidator;
const NegativeOrZero = Jymfony.Component.Validator.Constraints.NegativeOrZero;
const { expect } = require('chai');

describe('[Validator] Constraints.NegativeOrZero', function () {
    it ('value is zero', async () => {
        const constraint = new NegativeOrZero();
        expect(constraint.value).to.be.equal(0);
    });

    it ('value cannot be set', async () => {
        expect(() => new NegativeOrZero({ value: 5 })).to.throw(ConstraintDefinitionException);
    });

    it ('propertyPath cannot be set', async () => {
        expect(() => new NegativeOrZero({ propertyPath: 'foo' })).to.throw(ConstraintDefinitionException);
    });

    it ('should be validated by LessThan', async () => {
        const constraint = new NegativeOrZero();
        expect(constraint.validatedBy).to.be.equal(ReflectionClass.getClassName(LessThanOrEqualValidator));
    });
});
