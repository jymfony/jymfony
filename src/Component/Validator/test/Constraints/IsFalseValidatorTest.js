const IsFalse = Jymfony.Component.Validator.Constraints.IsFalse;
const IsFalseValidator = Jymfony.Component.Validator.Constraints.IsFalseValidator;
const { expect } = require('chai');

describe('[Validator] Constraints.IsFalseValidator', function () {
    const validValues = [
        null,
        '0',
        false,
        0,
        0.0,
    ];

    let index = 0;
    for (const valid of validValues) {
        it('should not raise violation #' + ++index, async () => {
            await expect(valid).to.be.validated.by(IsFalseValidator)
                .with.constraint(new IsFalse({ message: 'myMessage' }))
                .and.raise.no.violations();
        });
    }

    it ('should raise violation on true', async () => {
        await expect(true).to.be.validated.by(IsFalseValidator)
            .with.constraint(new IsFalse({ message: 'myMessage' }))
            .and.raise.violations([ {
                message: 'myMessage',
                code: IsFalse.NOT_FALSE_ERROR,
                parameters: {
                    '{{ value }}': 'true',
                },
                propertyPath: '',
            } ]);
    });
});
