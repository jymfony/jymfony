const Issn = Jymfony.Component.Validator.Constraints.Issn;
const IssnValidator = Jymfony.Component.Validator.Constraints.IssnValidator;
const { expect } = require('chai');

describe('[Validator] Constraints.IssnValidator', function () {
    it ('null should be valid', async () => {
        await expect(null).to.be.validated.by(IssnValidator)
            .with.constraint(new Issn())
            .and.raise.no.violations();
    });

    it ('undefined should be valid', async () => {
        await expect(undefined).to.be.validated.by(IssnValidator)
            .with.constraint(new Issn())
            .and.raise.no.violations();
    });

    it ('empty string should be valid', async () => {
        await expect('').to.be.validated.by(IssnValidator)
            .with.constraint(new Issn())
            .and.raise.no.violations();
    });

    const validLowercasedIssns = [
        '2162-321x',
        '2160-200x',
        '1537-453x',
        '1937-710x',
        '0002-922x',
        '1553-345x',
        '1553-619x',
    ];

    const validNonHyphenedIssns = [
        '2162321X',
        '01896016',
        '15744647',
        '14350645',
        '07174055',
        '20905076',
        '14401592',
    ];

    const fullValidIssns = [
        '1550-7416',
        '1539-8560',
        '2156-5376',
        '1119-023X',
        '1684-5315',
        '1996-0786',
        '1684-5374',
        '1996-0794',
    ];

    const invalidIssns = [
        [ 0, Issn.TOO_SHORT_ERROR ],
        [ '1539', Issn.TOO_SHORT_ERROR ],
        [ '2156-537A', Issn.INVALID_CHARACTERS_ERROR ],
        [ '1119-0231', Issn.CHECKSUM_FAILED_ERROR ],
        [ '1684-5312', Issn.CHECKSUM_FAILED_ERROR ],
        [ '1996-0783', Issn.CHECKSUM_FAILED_ERROR ],
        [ '1684-537X', Issn.CHECKSUM_FAILED_ERROR ],
        [ '1996-0795', Issn.CHECKSUM_FAILED_ERROR ],
    ];

    let i = 0;
    for (const issn of validLowercasedIssns) {
        it('should validate lowercased issn #' + ++i, async () => {
            await expect(issn).to.be.validated.by(IssnValidator)
                .with.constraint(new Issn({ caseSensitive: true, message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Issn.INVALID_CASE_ERROR,
                    parameters: {
                        '{{ value }}': '"' + issn + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const issn of validNonHyphenedIssns) {
        it('issn without hyphen should raise violation #' + ++i, async () => {
            await expect(issn).to.be.validated.by(IssnValidator)
                .with.constraint(new Issn({ message: 'myMessage', requireHyphen: true }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Issn.MISSING_HYPHEN_ERROR,
                    parameters: {
                        '{{ value }}': '"' + issn + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const issn of [ ...validNonHyphenedIssns, ...validLowercasedIssns, ...fullValidIssns ]) {
        it('should validate issn #' + ++i, async () => {
            await expect(issn).to.be.validated.by(IssnValidator)
                .with.constraint(new Issn())
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const [ issn, code ] of invalidIssns) {
        it('invalid issn should raise violation #' + ++i, async () => {
            await expect(issn).to.be.validated.by(IssnValidator)
                .with.constraint(new Issn({ message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code,
                    parameters: {
                        '{{ value }}': '"' + issn + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }
});
