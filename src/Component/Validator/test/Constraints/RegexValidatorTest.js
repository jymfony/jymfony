const Regex = Jymfony.Component.Validator.Constraints.Regex;
const RegexValidator = Jymfony.Component.Validator.Constraints.RegexValidator;
const { expect } = require('chai');

describe('[Validator] Constraints.RegexValidator', function () {
    it ('null should be valid', async () => {
        await expect(null).to.be.validated.by(RegexValidator)
            .with.constraint(new Regex({ pattern: /[a-z]/ }))
            .and.raise.no.violations();
    });

    it ('undefined should be valid', async () => {
        await expect(undefined).to.be.validated.by(RegexValidator)
            .with.constraint(new Regex({ pattern: /[a-z]/ }))
            .and.raise.no.violations();
    });

    const validValues = [
        0,
        '0',
        '090909',
        90909,
        new class {
            toString() {
                return '090909';
            }
        }(),
    ];

    const validValuesWithWhitespace = [
        '\x207',
        '\x09\x09070707\x09\x09',
        '70707\x0A',
        '7\x0D\x0D',
        '\x00070707\x00',
        '\x0B\x0B70707\x0B\x0B',
    ];

    const invalidValues = [
        'abcd',
        '090foo',
        new class {
            toString() {
                return 'abcd';
            }
        }(),
    ];

    let i = 0;
    for (const value of validValues) {
        it('should validate regex #' + ++i, async () => {
            await expect(value).to.be.validated.by(RegexValidator)
                .with.constraint(new Regex({ pattern: /^[0-9]+$/ }))
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const value of validValuesWithWhitespace) {
        it('should normalize and validate regex #' + ++i, async () => {
            await expect(value).to.be.validated.by(RegexValidator)
                .with.constraint(new Regex({ pattern: /^[0-9]+$/, normalizer: __jymfony.trim }))
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const value of invalidValues) {
        it('invalid value should raise violation #' + ++i, async () => {
            await expect(value).to.be.validated.by(RegexValidator)
                .with.constraint(new Regex({ message: 'myMessage', pattern: /^[0-9]+$/ }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Regex.REGEX_FAILED_ERROR,
                    parameters: {
                        '{{ value }}': '"' + value + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }
});
