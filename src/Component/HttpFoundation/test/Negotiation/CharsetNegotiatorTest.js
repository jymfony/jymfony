const AcceptCharset = Jymfony.Component.HttpFoundation.Negotiation.AcceptCharset;
const CharsetNegotiator = Jymfony.Component.HttpFoundation.Negotiation.CharsetNegotiator;
const Exception = Jymfony.Component.HttpFoundation.Negotiation.Exception;
const expect = require('chai').expect;

describe('[HttpFoundation] CharsetNegotiator', function () {
    it('getBest should return null with unmatched header', () => {
        const negotiator = new CharsetNegotiator();
        expect(negotiator.getBest('foo, bar, yo', [ 'baz' ])).to.be.null;
    });

    it('getBest should ignore non-existent content', () => {
        const negotiator = new CharsetNegotiator();
        const accept = negotiator.getBest('en; q=0.1, fr; q=0.4, bu; q=1.0', [ 'en', 'fr' ]);

        expect(accept).to.be.instanceof(AcceptCharset);
        expect(accept.value).to.be.equal('fr');
    });

    const pearCharset = 'ISO-8859-1, Big5;q=0.6,utf-8;q=0.7, *;q=0.5';
    const pearCharset2 = 'ISO-8859-1, Big5;q=0.6,utf-8;q=0.7';
    const testsForGetBest = [
        [ pearCharset, [ 'utf-8', 'big5', 'iso-8859-1', 'shift-jis' ], 'iso-8859-1' ],
        [ pearCharset, [ 'utf-8', 'big5', 'shift-jis' ], 'utf-8' ],
        [ pearCharset, [ 'Big5', 'shift-jis' ], 'Big5' ],
        [ pearCharset, [ 'shift-jis' ], 'shift-jis' ],
        [ pearCharset2, [ 'utf-8', 'big5', 'iso-8859-1', 'shift-jis' ], 'iso-8859-1' ],
        [ pearCharset2, [ 'utf-8', 'big5', 'shift-jis' ], 'utf-8' ],
        [ pearCharset2, [ 'Big5', 'shift-jis' ], 'Big5' ],
        [ 'utf-8;q=0.6,iso-8859-5;q=0.9', [ 'iso-8859-5', 'utf-8' ], 'iso-8859-5' ],
        [ '', [ 'iso-8859-5', 'utf-8' ], null ],
        [ 'en, *;q=0.9', [ 'fr' ], 'fr' ],
        // Quality of source factors
        [ pearCharset, [ 'iso-8859-1;q=0.5', 'utf-8', 'utf-16;q=1.0' ], 'utf-8' ],
        [ pearCharset, [ 'iso-8859-1;q=0.8', 'utf-8', 'utf-16;q=1.0' ], 'iso-8859-1;q=0.8' ],
    ];

    for (const [ accept, priorities, expected ] of testsForGetBest) {
        it('getBest should work', () => {
            const negotiator = new CharsetNegotiator();
            let best;

            try {
                best = negotiator.getBest(accept, priorities);
            } catch (e) {
                expect(expected).to.be.null;
                expect(e).to.be.instanceOf(Exception.InvalidArgumentException);

                return;
            }

            if (null === best) {
                expect(expected).to.be.null;
            } else {
                expect(best).to.be.instanceOf(AcceptCharset);
                expect(best.value).to.be.equal(expected);
            }
        });
    }

    it('should respect quality of source', () => {
        const negotiator = new CharsetNegotiator();
        const accept = negotiator.getBest('utf-8;q=0.5,iso-8859-1', [ 'iso-8859-1;q=0.3', 'utf-8;q=0.9', 'utf-16;q=1.0' ]);

        expect(accept).to.be.instanceOf(AcceptCharset);
        expect(accept.type).to.be.equal('utf-8');
    });
});
