const Length = Jymfony.Component.Validator.Constraints.Length;
const LengthValidator = Jymfony.Component.Validator.Constraints.LengthValidator;
const { expect } = require('chai');

describe('[Validator] Constraints.LengthValidator', function () {
    it ('null should be valid', async () => {
        await expect(null).to.be.validated.by(LengthValidator)
            .with.constraint(new Length({ value: 6 }))
            .and.raise.no.violations();
    });

    it ('undefined should be valid', async () => {
        await expect(undefined).to.be.validated.by(LengthValidator)
            .with.constraint(new Length({ value: 6 }))
            .and.raise.no.violations();
    });

    it ('empty string should be invalid', async () => {
        await expect('').to.be.validated.by(LengthValidator)
            .with.constraint(new Length({ value: 6, exactMessage: 'myMessage' }))
            .and.raise.violations([ {
                message: 'myMessage',
                code: Length.TOO_SHORT_ERROR,
                parameters: {
                    '{{ value }}': '""',
                    '{{ limit }}': 6,
                },
                invalidValue: '',
                plural: 6,
                propertyPath: '',
            } ]);
    });

    const threeOrLessChars = [
        12,
        '12',
        'üü',
        'éé',
        123,
        '123',
        'üüü',
        'ééé',
    ];

    const fourCharacters = [
        1234,
        '1234',
        'üüüü',
        'éééé',
    ];

    const fiveOrMoreCharacters = [
        12345,
        '12345',
        'üüüüü',
        'ééééé',
        123456,
        '123456',
        'üüüüüü',
        'éééééé',
    ];

    const threeCharactersWithWhitespaces = [
        '\x20ccc',
        '\x09c\x09c',
        '\x0Accc\x0A',
        'ccc\x0D\x0D',
        '\x00ccc\x00',
        '\x0Bc\x0Bc\x0B',
    ];

    let i = 0;
    for (const value of fiveOrMoreCharacters) {
        it('should validate min length string #' + ++i, async () => {
            await expect(value).to.be.validated.by(LengthValidator)
                .with.constraint(new Length({ min: 5 }))
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const value of threeOrLessChars) {
        it('should validate max length string #' + ++i, async () => {
            await expect(value).to.be.validated.by(LengthValidator)
                .with.constraint(new Length({ max: 3 }))
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const value of fourCharacters) {
        it('should validate exact length string #' + ++i, async () => {
            await expect(value).to.be.validated.by(LengthValidator)
                .with.constraint(new Length(4))
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const value of threeCharactersWithWhitespaces) {
        it('should validate exact length string with normalizer #' + ++i, async () => {
            await expect(value).to.be.validated.by(LengthValidator)
                .with.constraint(new Length({ min: 3, max: 3, normalizer: __jymfony.trim }))
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const value of threeOrLessChars) {
        it('should validate invalid min length string #' + ++i, async () => {
            await expect(value).to.be.validated.by(LengthValidator)
                .with.constraint(new Length({ min: 4, minMessage: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Length.TOO_SHORT_ERROR,
                    parameters: {
                        '{{ value }}': '"' + value + '"',
                        '{{ limit }}': 4,
                    },
                    invalidValue: value,
                    plural: 4,
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const value of fiveOrMoreCharacters) {
        it('should validate invalid max length string #' + ++i, async () => {
            await expect(value).to.be.validated.by(LengthValidator)
                .with.constraint(new Length({ max: 4, maxMessage: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Length.TOO_LONG_ERROR,
                    parameters: {
                        '{{ value }}': '"' + value + '"',
                        '{{ limit }}': 4,
                    },
                    invalidValue: value,
                    plural: 4,
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const value of threeOrLessChars) {
        it('should validate invalid exact length string #' + ++i, async () => {
            await expect(value).to.be.validated.by(LengthValidator)
                .with.constraint(new Length({ min: 4, max: 4, exactMessage: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Length.TOO_SHORT_ERROR,
                    parameters: {
                        '{{ value }}': '"' + value + '"',
                        '{{ limit }}': 4,
                    },
                    invalidValue: value,
                    plural: 4,
                    propertyPath: '',
                } ]);
        });
    }

    for (const value of fiveOrMoreCharacters) {
        it('should validate invalid exact length string #' + ++i, async () => {
            await expect(value).to.be.validated.by(LengthValidator)
                .with.constraint(new Length({ min: 4, max: 4, exactMessage: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Length.TOO_LONG_ERROR,
                    parameters: {
                        '{{ value }}': '"' + value + '"',
                        '{{ limit }}': 4,
                    },
                    invalidValue: value,
                    plural: 4,
                    propertyPath: '',
                } ]);
        });
    }
});
