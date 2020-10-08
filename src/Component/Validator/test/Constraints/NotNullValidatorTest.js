const NotNull = Jymfony.Component.Validator.Constraints.NotNull;
const NotNullValidator = Jymfony.Component.Validator.Constraints.NotNullValidator;
const { expect } = require('chai');

describe('[Validator] Constraints.NotNullValidator', function () {
    const validValues = [
        '',
        true,
        false,
        0,
        0.0,
        'test',
        [],
        {},
    ];

    let index = 0;
    for (const valid of validValues) {
        it('should not raise violation #' + ++index, async () => {
            await expect(valid).to.be.validated.by(NotNullValidator)
                .with.constraint(new NotNull({message: 'myMessage'}))
                .and.raise.no.violations();
        });
    }

    it ('should raise violation on null', async () => {
        await expect(null).to.be.validated.by(NotNullValidator)
            .with.constraint(new NotNull({ message: 'myMessage' }))
            .and.raise.violations([ {
                message: 'myMessage',
                code: NotNull.IS_NULL_ERROR,
                parameters: {
                    '{{ value }}': 'null',
                },
                propertyPath: '',
            } ]);
    });

    it ('should raise violation on undefined', async () => {
        await expect(undefined).to.be.validated.by(NotNullValidator)
            .with.constraint(new NotNull({ message: 'myMessage' }))
            .and.raise.violations([ {
                message: 'myMessage',
                code: NotNull.IS_NULL_ERROR,
                parameters: {
                    '{{ value }}': 'undefined',
                },
                propertyPath: '',
            } ]);
    });
});
