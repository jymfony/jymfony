const NotBlank = Jymfony.Component.Validator.Constraints.NotBlank;
const NotBlankValidator = Jymfony.Component.Validator.Constraints.NotBlankValidator;
const { expect } = require('chai');

describe('[Validator] Constraints.NotBlankValidator', function () {
    const validValues = [
        1234,
        '0',
        0,
        0.0,
        'foobar',
    ];

    let index = 0;
    for (const valid of validValues) {
        it('should not raise violation #' + ++index, async () => {
            await expect(valid).to.be.validated.by(NotBlankValidator)
                .with.constraint(new NotBlank({ message: 'myMessage' }))
                .and.raise.no.violations();
        });
    }

    it ('should raise violation on null', async () => {
        await expect(null).to.be.validated.by(NotBlankValidator)
            .with.constraint(new NotBlank({ message: 'myMessage' }))
            .and.raise.violations([ {
                message: 'myMessage',
                code: NotBlank.IS_BLANK_ERROR,
                parameters: {
                    '{{ value }}': 'null',
                },
                propertyPath: '',
            } ]);
    });

    it ('should raise violation on undefined', async () => {
        await expect(undefined).to.be.validated.by(NotBlankValidator)
            .with.constraint(new NotBlank({ message: 'myMessage' }))
            .and.raise.violations([ {
                message: 'myMessage',
                code: NotBlank.IS_BLANK_ERROR,
                parameters: {
                    '{{ value }}': 'undefined',
                },
                propertyPath: '',
            } ]);
    });

    it ('should raise violation on empty string', async () => {
        await expect('').to.be.validated.by(NotBlankValidator)
            .with.constraint(new NotBlank({ message: 'myMessage' }))
            .and.raise.violations([ {
                message: 'myMessage',
                code: NotBlank.IS_BLANK_ERROR,
                parameters: {
                    '{{ value }}': '""',
                },
                propertyPath: '',
            } ]);
    });

    it ('should raise violation on false', async () => {
        await expect(false).to.be.validated.by(NotBlankValidator)
            .with.constraint(new NotBlank({ message: 'myMessage' }))
            .and.raise.violations([ {
                message: 'myMessage',
                code: NotBlank.IS_BLANK_ERROR,
                parameters: {
                    '{{ value }}': 'false',
                },
                propertyPath: '',
            } ]);
    });

    it ('should raise violation on empty array', async () => {
        await expect([]).to.be.validated.by(NotBlankValidator)
            .with.constraint(new NotBlank({ message: 'myMessage' }))
            .and.raise.violations([ {
                message: 'myMessage',
                code: NotBlank.IS_BLANK_ERROR,
                parameters: {
                    '{{ value }}': 'array',
                },
                propertyPath: '',
            } ]);
    });

    it ('should raise violation on empty object', async () => {
        await expect({}).to.be.validated.by(NotBlankValidator)
            .with.constraint(new NotBlank({ message: 'myMessage' }))
            .and.raise.violations([ {
                message: 'myMessage',
                code: NotBlank.IS_BLANK_ERROR,
                parameters: {
                    '{{ value }}': 'object',
                },
                propertyPath: '',
            } ]);
    });

    it ('should allow null', async () => {
        await expect(null).to.be.validated.by(NotBlankValidator)
            .with.constraint(new NotBlank({ allowNull: true }))
            .and.raise.no.violations();
    });

    it ('should raise violation on empty normalized string', async () => {
        await expect('\x09\x09').to.be.validated.by(NotBlankValidator)
            .with.constraint(new NotBlank({ normalizer: __jymfony.trim, message: 'myMessage' }))
            .and.raise.violations([ {
                message: 'myMessage',
                code: NotBlank.IS_BLANK_ERROR,
                parameters: {
                    '{{ value }}': '""',
                },
                propertyPath: '',
            } ]);
    });
});
