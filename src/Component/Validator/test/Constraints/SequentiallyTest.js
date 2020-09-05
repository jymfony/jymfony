const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const NotBlank = Jymfony.Component.Validator.Constraints.NotBlank;
const Sequentially = Jymfony.Component.Validator.Constraints.Sequentially;
const Valid = Jymfony.Component.Validator.Constraints.Valid;
const { expect } = require('chai');

describe('[Validator] Constraints.Sequentially', function () {
    it ('constraints is defaultOption', async () => {
        const constraint = new Sequentially([ new NotBlank() ]);
        expect(constraint.constraints).to.have.length(1);
        expect(constraint.constraints[0]).to.be.instanceOf(NotBlank);
    });

    it ('should reject non-constraints', () => {
        expect(() => new Sequentially([ {} ]))
            .to.throw(ConstraintDefinitionException, 'The value "Object" is not an instance of Constraint in constraint "Jymfony.Component.Validator.Constraints.Sequentially".');
    });

    it ('should reject valid constraint', () => {
        expect(() => new Sequentially([ new Valid() ]))
            .to.throw(ConstraintDefinitionException, 'The constraint Valid cannot be nested inside constraint "Jymfony.Component.Validator.Constraints.Sequentially". You can only declare the Valid constraint directly on a field or method.');
    });
});
