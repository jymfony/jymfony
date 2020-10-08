const Luhn = Jymfony.Component.Validator.Constraints.Luhn;
const LuhnValidator = Jymfony.Component.Validator.Constraints.LuhnValidator;
const UnexpectedValueException = Jymfony.Component.Validator.Exception.UnexpectedValueException;
const { expect } = require('chai');

describe('[Validator] Constraints.LuhnValidator', function () {
    it ('null should be valid', async () => {
        await expect(null).to.be.validated.by(LuhnValidator)
            .with.constraint(new Luhn())
            .and.raise.no.violations();
    });

    it ('undefined should be valid', async () => {
        await expect(undefined).to.be.validated.by(LuhnValidator)
            .with.constraint(new Luhn())
            .and.raise.no.violations();
    });

    it ('empty string should be valid', async () => {
        await expect('').to.be.validated.by(LuhnValidator)
            .with.constraint(new Luhn())
            .and.raise.no.violations();
    });

    const validNumbers = [
        '42424242424242424242',
        '378282246310005',
        '371449635398431',
        '378734493671000',
        '5610591081018250',
        '30569309025904',
        '38520000023237',
        '6011111111111117',
        '6011000990139424',
        '3530111333300000',
        '3566002020360505',
        '5555555555554444',
        '5105105105105100',
        '4111111111111111',
        '4012888888881881',
        '4222222222222',
        '5019717010103742',
        '6331101999990016',
    ];

    const invalidNumbers = [
        [ '1234567812345678', Luhn.CHECKSUM_FAILED_ERROR ],
        [ '4222222222222222', Luhn.CHECKSUM_FAILED_ERROR ],
        [ '0000000000000000', Luhn.CHECKSUM_FAILED_ERROR ],
        [ '000000!000000000', Luhn.INVALID_CHARACTERS_ERROR ],
        [ '42-22222222222222', Luhn.INVALID_CHARACTERS_ERROR ],
    ];

    const invalidTypes = [
        0,
        123,
        42424242424242424242,
        378282246310005,
        371449635398431,
    ];

    let i = 0;
    for (const number of validNumbers) {
        it('should validate number #' + ++i, async () => {
            await expect(number).to.be.validated.by(LuhnValidator)
                .with.constraint(new Luhn())
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const [ number, code ] of invalidNumbers) {
        it('invalid number should raise violation #' + ++i, async () => {
            await expect(number).to.be.validated.by(LuhnValidator)
                .with.constraint(new Luhn({ message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code,
                    parameters: {
                        '{{ value }}': '"' + number + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const number of invalidTypes) {
        it('invalid type should throw #' + ++i, async () => {
            await expect(number).to.be.validated.by(LuhnValidator)
                .with.constraint(new Luhn())
                .and.throw(UnexpectedValueException);
        });
    }
});
