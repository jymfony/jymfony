const Ip = Jymfony.Component.Validator.Constraints.Ip;
const IpValidator = Jymfony.Component.Validator.Constraints.IpValidator;
const { expect } = require('chai');

describe('[Validator] Constraints.IbanValidator', function () {
    it ('null should be valid', async () => {
        await expect(null).to.be.validated.by(IpValidator)
            .with.constraint(new Ip())
            .and.raise.no.violations();
    });

    it ('undefined should be valid', async () => {
        await expect(undefined).to.be.validated.by(IpValidator)
            .with.constraint(new Ip())
            .and.raise.no.violations();
    });

    it ('empty string should be valid', async () => {
        await expect('').to.be.validated.by(IpValidator)
            .with.constraint(new Ip())
            .and.raise.no.violations();
    });

    const validIpsV4 = [
        '0.0.0.0',
        '10.0.0.0',
        '123.45.67.178',
        '172.16.0.0',
        '192.168.1.0',
        '224.0.0.1',
        '255.255.255.255',
        '127.0.0.0',
    ];

    let i = 0;
    for (const ip of validIpsV4) {
        it('should validate ipv4 #' + ++i, async () => {
            await expect(ip).to.be.validated.by(IpValidator)
                .with.constraint(new Ip({ version: Ip.V4 }))
                .and.raise.no.violations();
        });
    }

    const validIpsV4WithWhitespaces = [
        '\x200.0.0.0',
        '\x09\x0910.0.0.0',
        '123.45.67.178\x0A',
        '172.16.0.0\x0D\x0D',
        '\x00192.168.1.0\x00',
        '\x0B\x0B224.0.0.1\x0B\x0B',
    ];

    i = 0;
    for (const ip of validIpsV4WithWhitespaces) {
        it('should validate and normalize ipv4 #' + ++i, async () => {
            await expect(ip).to.be.validated.by(IpValidator)
                .with.constraint(new Ip({ version: Ip.V4, normalizer: __jymfony.trim }))
                .and.raise.no.violations();
        });
    }

    const validIpsV6 = [
        '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
        '2001:0DB8:85A3:0000:0000:8A2E:0370:7334',
        '2001:0Db8:85a3:0000:0000:8A2e:0370:7334',
        'fdfe:dcba:9876:ffff:fdc6:c46b:bb8f:7d4c',
        'fdc6:c46b:bb8f:7d4c:fdc6:c46b:bb8f:7d4c',
        'fdc6:c46b:bb8f:7d4c:0000:8a2e:0370:7334',
        'fe80:0000:0000:0000:0202:b3ff:fe1e:8329',
        'fe80:0:0:0:202:b3ff:fe1e:8329',
        'fe80::202:b3ff:fe1e:8329',
        '0:0:0:0:0:0:0:0',
        '::',
        '0::',
        '::0',
        '0::0',
        // IPv4 mapped to IPv6
        '2001:0db8:85a3:0000:0000:8a2e:0.0.0.0',
        '::0.0.0.0',
        '::255.255.255.255',
        '::123.45.67.178',
    ];

    i = 0;
    for (const ip of validIpsV6) {
        it('should validate ipv6 #' + ++i, async () => {
            await expect(ip).to.be.validated.by(IpValidator)
                .with.constraint(new Ip({ version: Ip.V6 }))
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const ip of [ ...validIpsV4, ...validIpsV6 ]) {
        it('should validate ip #' + ++i, async () => {
            await expect(ip).to.be.validated.by(IpValidator)
                .with.constraint(new Ip({ version: Ip.ALL }))
                .and.raise.no.violations();
        });
    }

    const invalidIpsV4 = [
        '0',
        '0.0',
        '0.0.0',
        '256.0.0.0',
        '0.256.0.0',
        '0.0.256.0',
        '0.0.0.256',
        '-1.0.0.0',
        'foobar',
    ];

    i = 0;
    for (const ip of invalidIpsV4) {
        it('invalid ipv4 should raise violation #' + ++i, async () => {
            await expect(ip).to.be.validated.by(IpValidator)
                .with.constraint(new Ip({ version: Ip.V4, message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Ip.INVALID_IP_ERROR,
                    parameters: {
                        '{{ value }}': '"' + ip + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }

    const invalidPrivateIpsV4 = [
        '10.0.0.0',
        '172.16.0.0',
        '192.168.1.0',
    ];

    i = 0;
    for (const ip of invalidPrivateIpsV4) {
        it('private ipv4 should raise violation #' + ++i, async () => {
            await expect(ip).to.be.validated.by(IpValidator)
                .with.constraint(new Ip({ version: Ip.V4_NO_PRIV, message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Ip.INVALID_IP_ERROR,
                    parameters: {
                        '{{ value }}': '"' + ip + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }

    const invalidReservedIpsV4 = [
        '0.0.0.0',
        '240.0.0.1',
        '255.255.255.255',
    ];

    i = 0;
    for (const ip of invalidReservedIpsV4) {
        it('reserved ipv4 should raise violation #' + ++i, async () => {
            await expect(ip).to.be.validated.by(IpValidator)
                .with.constraint(new Ip({ version: Ip.V4_NO_RES, message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Ip.INVALID_IP_ERROR,
                    parameters: {
                        '{{ value }}': '"' + ip + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const ip of [ ...invalidPrivateIpsV4, ...invalidReservedIpsV4 ]) {
        it('non-public ipv4 should raise violation #' + ++i, async () => {
            await expect(ip).to.be.validated.by(IpValidator)
                .with.constraint(new Ip({ version: Ip.V4_ONLY_PUBLIC, message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Ip.INVALID_IP_ERROR,
                    parameters: {
                        '{{ value }}': '"' + ip + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }

    const invalidIpsV6 = [
        'z001:0db8:85a3:0000:0000:8a2e:0370:7334',
        'fe80',
        'fe80:8329',
        'fe80:::202:b3ff:fe1e:8329',
        'fe80::202:b3ff::fe1e:8329',
        // IPv4 mapped to IPv6
        '2001:0db8:85a3:0000:0000:8a2e:0370:0.0.0.0',
        '::0.0',
        '::0.0.0',
        '::256.0.0.0',
        '::0.256.0.0',
        '::0.0.256.0',
        '::0.0.0.256',
    ];

    i = 0;
    for (const ip of invalidIpsV6) {
        it('invalid ipv6 should raise violation #' + ++i, async () => {
            await expect(ip).to.be.validated.by(IpValidator)
                .with.constraint(new Ip({ version: Ip.V6, message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Ip.INVALID_IP_ERROR,
                    parameters: {
                        '{{ value }}': '"' + ip + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }

    const invalidPrivateIpsV6 = [
        'fdfe:dcba:9876:ffff:fdc6:c46b:bb8f:7d4c',
        'fdc6:c46b:bb8f:7d4c:fdc6:c46b:bb8f:7d4c',
        'fdc6:c46b:bb8f:7d4c:0000:8a2e:0370:7334',
    ];

    i = 0;
    for (const ip of invalidPrivateIpsV6) {
        it('invalid private ipv6 should raise violation #' + ++i, async () => {
            await expect(ip).to.be.validated.by(IpValidator)
                .with.constraint(new Ip({ version: Ip.V6_NO_PRIV, message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Ip.INVALID_IP_ERROR,
                    parameters: {
                        '{{ value }}': '"' + ip + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }

    const invalidReservedIpsV6 = [
        '::1',
        '::ffff:100:bb8f',
        'fe80:c46b:bb8f:7d4c:0000:8a2e:0370:7334',
    ];

    i = 0;
    for (const ip of invalidReservedIpsV6) {
        it('invalid reserved ipv6 should raise violation #' + ++i, async () => {
            await expect(ip).to.be.validated.by(IpValidator)
                .with.constraint(new Ip({ version: Ip.V6_NO_RES, message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Ip.INVALID_IP_ERROR,
                    parameters: {
                        '{{ value }}': '"' + ip + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const ip of [ ...invalidPrivateIpsV6, ...invalidReservedIpsV6 ]) {
        it('invalid non-public ipv6 should raise violation #' + ++i, async () => {
            await expect(ip).to.be.validated.by(IpValidator)
                .with.constraint(new Ip({ version: Ip.V6_ONLY_PUBLIC, message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Ip.INVALID_IP_ERROR,
                    parameters: {
                        '{{ value }}': '"' + ip + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const ip of [ ...invalidIpsV4, ...invalidIpsV6 ]) {
        it('invalid ip should raise violation #' + ++i, async () => {
            await expect(ip).to.be.validated.by(IpValidator)
                .with.constraint(new Ip({ version: Ip.ALL, message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Ip.INVALID_IP_ERROR,
                    parameters: {
                        '{{ value }}': '"' + ip + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const ip of [ ...invalidPrivateIpsV4, ...invalidPrivateIpsV6 ]) {
        it('invalid private ip should raise violation #' + ++i, async () => {
            await expect(ip).to.be.validated.by(IpValidator)
                .with.constraint(new Ip({ version: Ip.ALL_NO_PRIV, message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Ip.INVALID_IP_ERROR,
                    parameters: {
                        '{{ value }}': '"' + ip + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const ip of [ ...invalidReservedIpsV4, ...invalidReservedIpsV6 ]) {
        it('invalid reserved ip should raise violation #' + ++i, async () => {
            await expect(ip).to.be.validated.by(IpValidator)
                .with.constraint(new Ip({ version: Ip.ALL_NO_RES, message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Ip.INVALID_IP_ERROR,
                    parameters: {
                        '{{ value }}': '"' + ip + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const ip of [ ...invalidPrivateIpsV4, ...invalidReservedIpsV4, ...invalidPrivateIpsV6, ...invalidReservedIpsV6 ]) {
        it('invalid non-public ip should raise violation #' + ++i, async () => {
            await expect(ip).to.be.validated.by(IpValidator)
                .with.constraint(new Ip({ version: Ip.ALL_ONLY_PUBLIC, message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Ip.INVALID_IP_ERROR,
                    parameters: {
                        '{{ value }}': '"' + ip + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }
});
