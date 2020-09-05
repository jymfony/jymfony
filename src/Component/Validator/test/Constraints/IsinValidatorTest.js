const Isin = Jymfony.Component.Validator.Constraints.Isin;
const IsinValidator = Jymfony.Component.Validator.Constraints.IsinValidator;
const { expect } = require('chai');

describe('[Validator] Constraints.IsinValidator', function () {
    it ('null should be valid', async () => {
        await expect(null).to.be.validated.by(IsinValidator)
            .with.constraint(new Isin())
            .and.raise.no.violations();
    });

    it ('undefined should be valid', async () => {
        await expect(undefined).to.be.validated.by(IsinValidator)
            .with.constraint(new Isin())
            .and.raise.no.violations();
    });

    it ('empty string should be valid', async () => {
        await expect('').to.be.validated.by(IsinValidator)
            .with.constraint(new Isin())
            .and.raise.no.violations();
    });

    const validIsin = [
        'XS2125535901', // Goldman Sachs International
        'DE000HZ8VA77', // UniCredit Bank AG
        'CH0528261156', // Leonteq Securities AG [Guernsey]
        'US0378331005', // Apple, Inc.
        'AU0000XVGZA3', // TREASURY CORP VICTORIA 5 3/4% 2005-2016
        'GB0002634946', // BAE Systems
        'CH0528261099', // Leonteq Securities AG [Guernsey]
        'XS2155672814', // OP Corporate Bank plc
        'XS2155687259', // Orbian Financial Services III, LLC
        'XS2155696672', // Sheffield Receivables Company LLC
    ];

    const invalidNumbers = [
        [ 'X', Isin.INVALID_LENGTH_ERROR ],
        [ 'XS', Isin.INVALID_LENGTH_ERROR ],
        [ 'XS2', Isin.INVALID_LENGTH_ERROR ],
        [ 'XS21', Isin.INVALID_LENGTH_ERROR ],
        [ 'XS215', Isin.INVALID_LENGTH_ERROR ],
        [ 'XS2155', Isin.INVALID_LENGTH_ERROR ],
        [ 'XS21556', Isin.INVALID_LENGTH_ERROR ],
        [ 'XS215569', Isin.INVALID_LENGTH_ERROR ],
        [ 'XS2155696', Isin.INVALID_LENGTH_ERROR ],
        [ 'XS21556966', Isin.INVALID_LENGTH_ERROR ],
        [ 'XS215569667', Isin.INVALID_LENGTH_ERROR ],

        [ 'X12155696679', Isin.INVALID_PATTERN_ERROR ],
        [ '123456789101', Isin.INVALID_PATTERN_ERROR ],
        [ 'XS215569667E', Isin.INVALID_PATTERN_ERROR ],
        [ 'XS215E69667A', Isin.INVALID_PATTERN_ERROR ],

        [ 'XS2112212144', Isin.INVALID_CHECKSUM_ERROR ],
        [ 'DE013228VA77', Isin.INVALID_CHECKSUM_ERROR ],
        [ 'CH0512361156', Isin.INVALID_CHECKSUM_ERROR ],
        [ 'XS2125660123', Isin.INVALID_CHECKSUM_ERROR ],
        [ 'XS2012587408', Isin.INVALID_CHECKSUM_ERROR ],
        [ 'XS2012380102', Isin.INVALID_CHECKSUM_ERROR ],
        [ 'XS2012239364', Isin.INVALID_CHECKSUM_ERROR ],
    ];

    let i = 0;
    for (const number of validIsin) {
        it('should validate number #' + ++i, async () => {
            await expect(number).to.be.validated.by(IsinValidator)
                .with.constraint(new Isin())
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const [ number, code ] of invalidNumbers) {
        it('invalid number should raise violation #' + ++i, async () => {
            await expect(number).to.be.validated.by(IsinValidator)
                .with.constraint(new Isin({ message: 'myMessage' }))
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
});
