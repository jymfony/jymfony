const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const GreaterThanOrEqualValidator = Jymfony.Component.Validator.Constraints.GreaterThanOrEqualValidator;
const PositiveOrZero = Jymfony.Component.Validator.Constraints.PositiveOrZero;
const { expect } = require('chai');

describe('[Validator] Constraints.PositiveOrZero', function () {
    it ('value is zero', async () => {
        const constraint = new PositiveOrZero();
        expect(constraint.value).to.be.equal(0);
    });

    it ('value cannot be set', async () => {
        expect(() => new PositiveOrZero({ value: 5 })).to.throw(ConstraintDefinitionException);
    });

    it ('propertyPath cannot be set', async () => {
        expect(() => new PositiveOrZero({ propertyPath: 'foo' })).to.throw(ConstraintDefinitionException);
    });

    it ('should be validated by GreaterThan', async () => {
        const constraint = new PositiveOrZero();
        expect(constraint.validatedBy).to.be.equal(ReflectionClass.getClassName(GreaterThanOrEqualValidator));
    });
});
