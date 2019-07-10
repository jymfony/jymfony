const AcceptLanguage = Jymfony.Component.HttpFoundation.Negotiation.AcceptLanguage;
const LanguageNegotiator = Jymfony.Component.HttpFoundation.Negotiation.LanguageNegotiator;
const Exception = Jymfony.Component.HttpFoundation.Negotiation.Exception;
const { expect } = require('chai');

describe('[HttpFoundation] CharsetNegotiator', function () {
    const testsForGetBest = [
        [ 'en, de', [ 'fr' ], null ],
        [ 'foo, bar, yo', [ 'baz', 'biz' ], null ],
        [ 'fr-FR, en;q=0.8', [ 'en-US', 'de-DE' ], 'en-US' ],
        [ 'en, *;q=0.9', [ 'fr' ], 'fr' ],
        [ 'foo, bar, yo', [ 'yo' ], 'yo' ],
        [ 'en; q=0.1, fr; q=0.4, bu; q=1.0', [ 'en', 'fr' ], 'fr' ],
        [ 'en; q=0.1, fr; q=0.4, fu; q=0.9, de; q=0.2', [ 'en', 'fu' ], 'fu' ],
        [ '', [ 'en', 'fu' ], new Exception.InvalidArgumentException('The header string should not be empty.') ],
        [ 'fr, zh-Hans-CN;q=0.3', [ 'fr' ], 'fr' ],
        // Quality of source factors
        [ 'en;q=0.5,de', [ 'de;q=0.3', 'en;q=0.9' ], 'en;q=0.9' ],
    ];

    for (const [ accept, priorities, expected ] of testsForGetBest) {
        it('getBest should work', () => {
            const negotiator = new LanguageNegotiator();
            let best;

            try {
                best = negotiator.getBest(accept, priorities);
            } catch (e) {
                if (! (e instanceof Exception.ExceptionInterface)) {
                    throw e;
                }

                expect(ReflectionClass.getClassName(e)).to.be.equal(ReflectionClass.getClassName(expected));
                expect(e.message).to.be.equal(expected.message);

                return;
            }

            if (null === best) {
                expect(expected).to.be.null;
            } else {
                expect(best).to.be.instanceOf(AcceptLanguage);
                expect(best.value).to.be.equal(expected);
            }
        });
    }

    it('should respect quality of source', () => {
        const negotiator = new LanguageNegotiator();
        const accept = negotiator.getBest('en;q=0.5,de', [ 'de;q=0.3', 'en;q=0.9' ]);

        expect(accept).to.be.instanceOf(AcceptLanguage);
        expect(accept.type).to.be.equal('en');
    });
});
