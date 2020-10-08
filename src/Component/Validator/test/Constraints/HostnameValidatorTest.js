const Hostname = Jymfony.Component.Validator.Constraints.Hostname;
const HostnameValidator = Jymfony.Component.Validator.Constraints.HostnameValidator;
const { expect } = require('chai');

describe('[Validator] Constraints.HostnameValidator', function () {
    it ('null should be valid', async () => {
        await expect(null).to.be.validated.by(HostnameValidator)
            .with.constraint(new Hostname())
            .and.raise.no.violations();
    });

    it ('undefined should be valid', async () => {
        await expect(undefined).to.be.validated.by(HostnameValidator)
            .with.constraint(new Hostname())
            .and.raise.no.violations();
    });

    it ('empty string should be valid', async () => {
        await expect('').to.be.validated.by(HostnameValidator)
            .with.constraint(new Hostname())
            .and.raise.no.violations();
    });

    const multiLevelDomains = [
        'jymfony.com',
        'example.co.uk',
        'example.fr',
        'example.com',
        'xn--diseolatinoamericano-66b.com',
        'xn--ggle-0nda.com',
        'www.xn--simulateur-prt-2kb.fr',
        'a'.repeat(20) + '.com',
    ];

    let i = 0;
    for (const domain of multiLevelDomains) {
        it('should validate multi level domain #' + ++i, async () => {
            await expect(domain).to.be.validated.by(HostnameValidator)
                .with.constraint(new Hostname())
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const domain of multiLevelDomains) {
        it('should validate multi level domain with require tld #' + ++i, async () => {
            await expect(domain).to.be.validated.by(HostnameValidator)
                .with.constraint(new Hostname({ requireTld: false }))
                .and.raise.no.violations();
        });
    }

    const invalidDomains = [
        'acme..com',
        'qq--.com',
        '-example.com',
        'example-.com',
        'a'.repeat(300) + '.com',
    ];

    i = 0;
    for (const domain of invalidDomains) {
        it('should raise violation if require tld is set #' + ++i, async () => {
            await expect(domain).to.be.validated.by(HostnameValidator)
                .with.constraint(new Hostname({ message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Hostname.INVALID_HOSTNAME_ERROR,
                    parameters: {
                        '{{ value }}': '"' + domain + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const domain of invalidDomains) {
        it('should raise violation if require tld is not set #' + ++i, async () => {
            await expect(domain).to.be.validated.by(HostnameValidator)
                .with.constraint(new Hostname({ message: 'myMessage', requireTld: false }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Hostname.INVALID_HOSTNAME_ERROR,
                    parameters: {
                        '{{ value }}': '"' + domain + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }

    const reservedDomains = [
        'example',
        'foo.example',
        'invalid',
        'bar.invalid',
        'localhost',
        'lol.localhost',
        'test',
        'abc.test',
    ];

    i = 0;
    for (const domain of reservedDomains) {
        it('should raise violation if require tld is set on reserved tld #' + ++i, async () => {
            await expect(domain).to.be.validated.by(HostnameValidator)
                .with.constraint(new Hostname({ message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Hostname.INVALID_HOSTNAME_ERROR,
                    parameters: {
                        '{{ value }}': '"' + domain + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const domain of reservedDomains) {
        it('should not raise violation if require tld is not set on reserved tld #' + ++i, async () => {
            await expect(domain).to.be.validated.by(HostnameValidator)
                .with.constraint(new Hostname({ message: 'myMessage', requireTld: false }))
                .and.raise.no.violations();
        });
    }

    const tlds = [
        'com',
        'net',
        'org',
        'etc',
    ];

    i = 0;
    for (const domain of tlds) {
        it('should not raise violation on top level domain if requireTld is not set #' + ++i, async () => {
            await expect(domain).to.be.validated.by(HostnameValidator)
                .with.constraint(new Hostname({ message: 'myMessage', requireTld: false }))
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const domain of tlds) {
        it('should raise violation on top level domain #' + ++i, async () => {
            await expect(domain).to.be.validated.by(HostnameValidator)
                .with.constraint(new Hostname({ message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Hostname.INVALID_HOSTNAME_ERROR,
                    parameters: {
                        '{{ value }}': '"' + domain + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }
});
