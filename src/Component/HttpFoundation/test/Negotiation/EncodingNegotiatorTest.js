const AcceptEncoding = Jymfony.Component.HttpFoundation.Negotiation.AcceptEncoding;
const EncodingNegotiator = Jymfony.Component.HttpFoundation.Negotiation.EncodingNegotiator;
const { expect } = require('chai');

describe('[HttpFoundation] CharsetNegotiator', function () {
    const testsForGetBest = [
        [ 'gzip;q=1.0, identity; q=0.5, *;q=0', [ 'identity' ], 'identity' ],
        [ 'gzip;q=0.5, identity; q=0.5, *;q=0.7', [ 'bzip', 'foo' ], 'bzip' ],
        [ 'gzip;q=0.7, identity; q=0.5, *;q=0.7', [ 'gzip', 'foo' ], 'gzip' ],
        // Quality of source factors
        [ 'gzip;q=0.7,identity', [ 'identity;q=0.5', 'gzip;q=0.9' ], 'gzip;q=0.9' ],
    ];

    for (const [ accept, priorities, expected ] of testsForGetBest) {
        it('getBest should work', () => {
            const negotiator = new EncodingNegotiator();
            const best = negotiator.getBest(accept, priorities);

            if (null === best) {
                expect(expected).to.be.null;
            } else {
                expect(best).to.be.instanceOf(AcceptEncoding);
                expect(best.value).to.be.equal(expected);
            }
        });
    }

    it('should respect quality of source', () => {
        const negotiator = new EncodingNegotiator();
        const accept = negotiator.getBest('gzip;q=0.7,identity', [ 'identity;q=0.5', 'gzip;q=0.9' ]);

        expect(accept).to.be.instanceOf(AcceptEncoding);
        expect(accept.type).to.be.equal('gzip');
    });
});
