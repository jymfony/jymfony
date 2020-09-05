const Email = Jymfony.Component.Validator.Constraints.Email;
const EmailValidator = Jymfony.Component.Validator.Constraints.EmailValidator;
const InvalidArgumentException = Jymfony.Component.Validator.Exception.InvalidArgumentException;
const { expect } = require('chai');

describe('[Validator] Constraints.EmailValidator', function () {
    it ('unknown default mode should throw', async () => {
        await expect(() => new EmailValidator('Unknown mode'))
            .to.throw(InvalidArgumentException, 'The "defaultMode" parameter value is not valid.');
    });

    it ('unknown mode should throw', async () => {
        const constraint = new Email();
        constraint.mode = 'Unknown mode';

        await expect('email@example..org').to.be.validated.by(EmailValidator)
            .with.constraint(constraint)
            .and.throw(InvalidArgumentException, 'The "Jymfony.Component.Validator.Constraints.Email.mode" parameter value is not valid.');
    });

    it ('empty values are valid', async () => {
        await expect(null).to.be.validated.by(EmailValidator)
            .with.constraint(new Email())
            .and.raise.no.violations();

        await expect(undefined).to.be.validated.by(EmailValidator)
            .with.constraint(new Email())
            .and.raise.no.violations();

        await expect('').to.be.validated.by(EmailValidator)
            .with.constraint(new Email())
            .and.raise.no.violations();
    });

    const getValidEmails = function * () {
        yield [ 'alekitto@jymfony.com' ];
        yield [ 'example@example.co.uk' ];
        yield [ 'ale_kitto@example.it' ];
        yield [ 'example@example.co..uk' ];
        yield [ '{}~!@!@£$%%^&*().!@£$%^&*()' ];
        yield [ 'example@example.co..uk' ];
        yield [ 'example@-example.com' ];
        yield [ __jymfony.sprintf('example@%s.com', 'a'.repeat(64)) ];
    };

    const getInvalidEmails = function * () {
        yield [ 'example' ];
        yield [ 'example@' ];
        yield [ 'example@localhost' ];
        yield [ 'foo@example.com bar' ];
    };

    const getValidEmailsWithWhitespaces = function * () {
        yield [ '\x20example@example.co.uk\x20' ];
        yield [ '\x09\x09example@example.co..uk\x09\x09' ];
        yield [ '\x0A{}~!@!@£$%%^&*().!@£$%^&*()\x0A' ];
        yield [ '\x0D\x0Dexample@example.co..uk\x0D\x0D' ];
        yield [ '\x00example@-example.com' ];
        yield [ 'example@example.com\x0B\x0B' ];
    };

    const getValidEmailsHtml5 = function * () {
        yield [ 'alekitto@symfony.com' ];
        yield [ 'example@example.co.uk' ];
        yield [ 'ale_kitto@example.it' ];
        yield [ '{}~!@example.com' ];
    };

    const getInvalidEmailsHtml5 = function * () {
        yield [ 'example' ];
        yield [ 'example@' ];
        yield [ 'example@localhost' ];
        yield [ 'example@example.co..uk' ];
        yield [ 'foo@example.com bar' ];
        yield [ 'example@example.' ];
        yield [ 'example@.fr' ];
        yield [ '@example.com' ];
        yield [ 'example@example.com;example@example.com' ];
        yield [ 'example@.' ];
        yield [ ' example@example.com' ];
        yield [ 'example@ ' ];
        yield [ ' example@example.com ' ];
        yield [ ' example @example .com ' ];
        yield [ 'example@-example.com' ];
    };

    let index = 1;
    for (const [ email ] of getValidEmails()) {
        it ('should validate emails: loose - valid #' + index++, async () => {
            await expect(email).to.be.validated.by(EmailValidator)
                .with.constraint(Email)
                .and.raise.no.violations();
        });
    }

    index = 1;
    for (const [ email ] of getValidEmailsWithWhitespaces()) {
        it ('should validate emails: loose normalized - valid #' + index++, async () => {
            await expect(email).to.be.validated.by(EmailValidator)
                .with.constraint(new Email({ normalizer: __jymfony.trim }))
                .and.raise.no.violations();
        });
    }

    index = 1;
    for (const [ email ] of getValidEmailsHtml5()) {
        it ('should validate emails: html5 - valid #' + index++, async () => {
            await expect(email).to.be.validated.by(EmailValidator)
                .with.constraint(new Email({ mode: Email.VALIDATION_MODE_HTML5 }))
                .and.raise.no.violations();
        });
    }

    index = 1;
    for (const [ email ] of getInvalidEmails()) {
        it ('should validate emails: loose - invalid #' + index++, async () => {
            await expect(email).to.be.validated.by(EmailValidator)
                .with.constraint(new Email({ message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    parameters: {
                        '{{ value }}': '"' + email + '"',
                    },
                    propertyPath: '',
                    code: Email.INVALID_FORMAT_ERROR,
                } ]);
        });
    }

    index = 1;
    for (const [ email ] of getInvalidEmailsHtml5()) {
        it ('should validate emails: html5 - invalid #' + index++, async () => {
            await expect(email).to.be.validated.by(EmailValidator)
                .with.constraint(new Email({ mode: Email.VALIDATION_MODE_HTML5, message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    parameters: {
                        '{{ value }}': '"' + email + '"',
                    },
                    propertyPath: '',
                    code: Email.INVALID_FORMAT_ERROR,
                } ]);
        });
    }
});
