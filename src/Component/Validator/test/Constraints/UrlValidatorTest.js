const Url = Jymfony.Component.Validator.Constraints.Url;
const UrlValidator = Jymfony.Component.Validator.Constraints.UrlValidator;
const { expect } = require('chai');

describe('[Validator] Constraint.UrlValidator', function () {
    it ('null should be valid', async () => {
        await expect(null).to.be.validated.by(UrlValidator)
            .with.constraint(new Url())
            .and.raise.no.violations();
    });

    it ('undefined should be valid', async () => {
        await expect(undefined).to.be.validated.by(UrlValidator)
            .with.constraint(new Url())
            .and.raise.no.violations();
    });

    it ('empty string should be valid', async () => {
        await expect('').to.be.validated.by(UrlValidator)
            .with.constraint(new Url())
            .and.raise.no.violations();
    });

    const validUrls = [
        'http://a.pl',
        'http://www.example.com',
        'http://www.example.com.',
        'http://www.example.museum',
        'https://example.com/',
        'https://example.com:80/',
        'http://examp_le.com',
        'http://www.sub_domain.examp_le.com',
        'http://www.example.coop/',
        'http://www.test-example.com/',
        'http://www.jymfony.com/',
        'http://jymfony.fake/blog/',
        'http://jymfony.com/?',
        'http://jymfony.com/search?type=&q=url+validator',
        'http://jymfony.com/#',
        'http://jymfony.com/#?',
        'http://www.jymfony.com/doc/current/book/validation.html#supported-constraints',
        'http://very.long.domain.name.com/',
        'http://localhost/',
        'http://myhost123/',
        'http://127.0.0.1/',
        'http://127.0.0.1:80/',
        'http://[::1]/',
        'http://[::1]:80/',
        'http://[1:2:3::4:5:6:7]/',
        'http://sãopaulo.com/',
        'http://xn--sopaulo-xwa.com/',
        'http://sãopaulo.com.br/',
        'http://xn--sopaulo-xwa.com.br/',
        'http://пример.испытание/',
        'http://xn--e1afmkfd.xn--80akhbyknj4f/',
        'http://مثال.إختبار/',
        'http://xn--mgbh0fb.xn--kgbechtv/',
        'http://例子.测试/',
        'http://xn--fsqu00a.xn--0zwm56d/',
        'http://例子.測試/',
        'http://xn--fsqu00a.xn--g6w251d/',
        'http://例え.テスト/',
        'http://xn--r8jz45g.xn--zckzah/',
        'http://مثال.آزمایشی/',
        'http://xn--mgbh0fb.xn--hgbk6aj7f53bba/',
        'http://실례.테스트/',
        'http://xn--9n2bp8q.xn--9t4b11yi5a/',
        'http://العربية.idn.icann.org/',
        'http://xn--ogb.idn.icann.org/',
        'http://xn--e1afmkfd.xn--80akhbyknj4f.xn--e1afmkfd/',
        'http://xn--espaa-rta.xn--ca-ol-fsay5a/',
        'http://xn--d1abbgf6aiiy.xn--p1ai/',
        'http://☎.com/',
        'http://username:password@jymfony.com',
        'http://user.name:password@jymfony.com',
        'http://user_name:pass_word@jymfony.com',
        'http://username:pass.word@jymfony.com',
        'http://user.name:pass.word@jymfony.com',
        'http://user-name@jymfony.com',
        'http://user_name@jymfony.com',
        'http://u%24er:password@jymfony.com',
        'http://user:pa%24%24word@jymfony.com',
        'http://jymfony.com?',
        'http://jymfony.com?query=1',
        'http://jymfony.com/?query=1',
        'http://jymfony.com#',
        'http://jymfony.com#fragment',
        'http://jymfony.com/#fragment',
        'http://jymfony.com/#one_more%20test',
        'http://example.com/exploit.html?hello[0]=test',
    ];

    let i = 0;
    for (const url of validUrls) {
        it('should not raise assertions on valid url #' + ++i, async () => {
            await expect(url).to.be.validated.by(UrlValidator)
                .with.constraint(Url)
                .and.raise.no.violations();
        });
    }

    const relativeUrls = [
        '//example.com',
        '//examp_le.com',
        '//jymfony.fake/blog/',
        '//jymfony.com/search?type=&q=url+validator',
    ];

    i = 0;
    for (const url of [ ...relativeUrls, ...validUrls ]) {
        it('should not raise assertions on valid relative url #' + ++i, async () => {
            await expect(url).to.be.validated.by(UrlValidator)
                .with.constraint(new Url({ relativeProtocol: true }))
                .and.raise.no.violations();
        });
    }

    const validUrlsWithWhitespaces = [
        [ '\x20http://www.example.com' ],
        [ '\x09\x09http://www.example.com.' ],
        [ 'http://jymfony.fake/blog/\x0A' ],
        [ 'http://jymfony.com/search?type=&q=url+validator\x0D\x0D' ],
        [ '\x00https://example.com:80\x00' ],
        [ '\x0B\x0Bhttp://username:password@jymfony.com\x0B\x0B' ],
    ];

    i = 0;
    for (const url of validUrlsWithWhitespaces) {
        it('should not raise violations on url with whitespaces #' + ++i, async () => {
            await expect(url).to.be.validated.by(UrlValidator)
                .with.constraint(new Url({normalizer: __jymfony.trim}))
                .and.raise.no.violations();
        });
    }

    const invalidUrls = [
        'example.com',
        '://example.com',
        'http ://example.com',
        'http:/example.com',
        'http://example.com::aa',
        'http://example.com:aa',
        'ftp://example.fr',
        'faked://example.fr',
        'http://127.0.0.1:aa/',
        'ftp://[::1]/',
        'http://[::1',
        'http://username:passwordjymfony.com',
        'http://',
    ];

    i = 0;
    for (const url of invalidUrls) {
        it ('should raise violation on invalid url #' + ++i, async () => {
            await expect(url).to.be.validated.by(UrlValidator)
                .with.constraint(new Url({ message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    parameters: {
                        '{{ value }}': '"' + url + '"',
                    },
                    code: Url.INVALID_URL_ERROR,
                } ]);
        });
    }

    const invalidRelativeUrls = [
        '/example.com',
        '//example.com::aa',
        '//example.com:aa',
        '//127.0.0.1:aa/',
        '//[::1',
        '//username:passwordjymfony.com',
        '//',
    ];

    i = 0;
    for (const url of [ ...invalidRelativeUrls, ...invalidUrls ]) {
        it ('should raise violation on relative invalid url #' + ++i, async () => {
            await expect(url).to.be.validated.by(UrlValidator)
                .with.constraint(new Url({ relativeProtocol: true, message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    parameters: {
                        '{{ value }}': '"' + url + '"',
                    },
                    code: Url.INVALID_URL_ERROR,
                } ]);
        });
    }

    const customProtocolUrls = [
        'ftp://example.com',
        'file://127.0.0.1',
        'git://[::1]/',
    ];

    i = 0;
    for (const url of customProtocolUrls) {
        it ('should raise not violation on custom protocol #' + ++i, async () => {
            await expect(url).to.be.validated.by(UrlValidator)
                .with.constraint(new Url({ protocols: [ 'ftp', 'file', 'git' ], message: 'myMessage' }))
                .and.raise.no.violations();
        });
    }
});
