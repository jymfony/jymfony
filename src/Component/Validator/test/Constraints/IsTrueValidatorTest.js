const IsTrue = Jymfony.Component.Validator.Constraints.IsTrue;
const IsTrueValidator = Jymfony.Component.Validator.Constraints.IsTrueValidator;
const { expect } = require('chai');

describe('[Validator] Constraints.IsTrueValidator', function () {
    const validValues = [
        '1',
        true,
        1,
        1.0,
    ];

    let index = 0;
    for (const valid of validValues) {
        it('should not raise violation #' + ++index, async () => {
            await expect(valid).to.be.validated.by(IsTrueValidator)
                .with.constraint(new IsTrue({ message: 'myMessage' }))
                .and.raise.no.violations();
        });
    }

    it ('should raise violation on false', async () => {
        await expect(false).to.be.validated.by(IsTrueValidator)
            .with.constraint(new IsTrue({ message: 'myMessage' }))
            .and.raise.violations([ {
                message: 'myMessage',
                code: IsTrue.NOT_TRUE_ERROR,
                parameters: {
                    '{{ value }}': 'false',
                },
                propertyPath: '',
            } ]);
    });
});
