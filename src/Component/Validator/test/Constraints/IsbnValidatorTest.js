const Isbn = Jymfony.Component.Validator.Constraints.Isbn;
const IsbnValidator = Jymfony.Component.Validator.Constraints.IsbnValidator;
const { expect } = require('chai');

describe('[Validator] Constraints.IsbnValidator', function () {
    it ('null should be valid', async () => {
        await expect(null).to.be.validated.by(IsbnValidator)
            .with.constraint(new Isbn())
            .and.raise.no.violations();
    });

    it ('undefined should be valid', async () => {
        await expect(undefined).to.be.validated.by(IsbnValidator)
            .with.constraint(new Isbn())
            .and.raise.no.violations();
    });

    it ('empty string should be valid', async () => {
        await expect('').to.be.validated.by(IsbnValidator)
            .with.constraint(new Isbn())
            .and.raise.no.violations();
    });

    const validIsbns10 = [
        '2723442284',
        '2723442276',
        '2723455041',
        '2070546810',
        '2711858839',
        '2756406767',
        '2870971648',
        '226623854X',
        '2851806424',
        '0321812700',
        '0-45122-5244',
        '0-4712-92311',
        '0-9752298-0-X',
    ];

    const invalidIsbns10 = [
        [ '27234422841', Isbn.TOO_LONG_ERROR ],
        [ '272344228', Isbn.TOO_SHORT_ERROR ],
        [ '0-4712-9231', Isbn.TOO_SHORT_ERROR ],
        [ '1234567890', Isbn.CHECKSUM_FAILED_ERROR ],
        [ '0987656789', Isbn.CHECKSUM_FAILED_ERROR ],
        [ '7-35622-5444', Isbn.CHECKSUM_FAILED_ERROR ],
        [ '0-4X19-92611', Isbn.CHECKSUM_FAILED_ERROR ],
        [ '0_45122_5244', Isbn.INVALID_CHARACTERS_ERROR ],
        [ '2870#971#648', Isbn.INVALID_CHARACTERS_ERROR ],
        [ '0-9752298-0-x', Isbn.INVALID_CHARACTERS_ERROR ],
        [ '1A34567890', Isbn.INVALID_CHARACTERS_ERROR ],
        // 2070546810 is valid
        [ '2\x0170546810', Isbn.INVALID_CHARACTERS_ERROR ],
    ];

    const validIsbns13 = [
        '978-2723442282',
        '978-2723442275',
        '978-2723455046',
        '978-2070546817',
        '978-2711858835',
        '978-2756406763',
        '978-2870971642',
        '978-2266238540',
        '978-2851806420',
        '978-0321812704',
        '978-0451225245',
        '978-0471292319',
    ];

    const invalidIsbns13 = [
        [ '978-27234422821', Isbn.TOO_LONG_ERROR ],
        [ '978-272344228', Isbn.TOO_SHORT_ERROR ],
        [ '978-2723442-82', Isbn.TOO_SHORT_ERROR ],
        [ '978-2723442281', Isbn.CHECKSUM_FAILED_ERROR ],
        [ '978-0321513774', Isbn.CHECKSUM_FAILED_ERROR ],
        [ '979-0431225385', Isbn.CHECKSUM_FAILED_ERROR ],
        [ '980-0474292319', Isbn.CHECKSUM_FAILED_ERROR ],
        [ '0-4X19-92619812', Isbn.INVALID_CHARACTERS_ERROR ],
        [ '978_2723442282', Isbn.INVALID_CHARACTERS_ERROR ],
        [ '978#2723442282', Isbn.INVALID_CHARACTERS_ERROR ],
        [ '978-272C442282', Isbn.INVALID_CHARACTERS_ERROR ],
        // 978-2070546817 is valid
        [ '978-2\x0170546817', Isbn.INVALID_CHARACTERS_ERROR ],
    ];

    let i = 0;
    for (const isbn of validIsbns10) {
        it('should validate isbn10 #' + ++i, async () => {
            await expect(isbn).to.be.validated.by(IsbnValidator)
                .with.constraint(new Isbn({ type: 'isbn10' }))
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const [ isbn, code ] of invalidIsbns10) {
        it('invalid isbn10 should raise violation #' + ++i, async () => {
            await expect(isbn).to.be.validated.by(IsbnValidator)
                .with.constraint(new Isbn({ message: 'myMessage', type: 'isbn10' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code,
                    parameters: {
                        '{{ value }}': '"' + isbn + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const isbn of validIsbns13) {
        it('should validate isbn13 #' + ++i, async () => {
            await expect(isbn).to.be.validated.by(IsbnValidator)
                .with.constraint(new Isbn({ type: 'isbn13' }))
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const [ isbn, code ] of invalidIsbns13) {
        it('invalid isbn13 should raise violation #' + ++i, async () => {
            await expect(isbn).to.be.validated.by(IsbnValidator)
                .with.constraint(new Isbn({ message: 'myMessage', type: 'isbn13' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code,
                    parameters: {
                        '{{ value }}': '"' + isbn + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const isbn of [ ...validIsbns10, ...validIsbns13 ]) {
        it('should validate isbn #' + ++i, async () => {
            await expect(isbn).to.be.validated.by(IsbnValidator)
                .with.constraint(new Isbn())
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (let [ isbn, code ] of invalidIsbns10) {
        it('invalid isbn should raise violation #' + ++i, async () => {
            if (code === Isbn.TOO_LONG_ERROR) {
                code = Isbn.TYPE_NOT_RECOGNIZED_ERROR;
            }

            await expect(isbn).to.be.validated.by(IsbnValidator)
                .with.constraint(new Isbn({ bothIsbnMessage: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code,
                    parameters: {
                        '{{ value }}': '"' + isbn + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }

    for (let [ isbn, code ] of invalidIsbns13) {
        it('invalid isbn should raise violation #' + ++i, async () => {
            if (code === Isbn.TOO_SHORT_ERROR) {
                code = Isbn.TYPE_NOT_RECOGNIZED_ERROR;
            }

            await expect(isbn).to.be.validated.by(IsbnValidator)
                .with.constraint(new Isbn({ bothIsbnMessage: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code,
                    parameters: {
                        '{{ value }}': '"' + isbn + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }
});
