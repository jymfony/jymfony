const BaseAccept = Jymfony.Component.HttpFoundation.Negotiation.BaseAccept;
const { expect } = require('chai');

class DummyAccept extends BaseAccept {
}

describe('[HttpFoundation] BaseAccept', function () {
    const testsForParseParameters = [
        [
            'application/json ;q=1.0; level=2;foo= bar',
            {
                q: 1.0,
                level: '2',
                foo: 'bar',
            },
        ],
        [
            'application/json ;q = 1.0; level = 2;     FOO  = bAr',
            {
                q: 1.0,
                level: '2',
                foo: 'bAr',
            },
        ],
        [
            'application/json;q=1.0',
            {
                q: 1.0,
            },
        ],
        [
            'application/json;foo',
            {},
        ],
    ];

    for (const [ value, expected ] of testsForParseParameters) {
        it('should parse parameters correctly', () => {
            const accept = new DummyAccept(value);
            const parameters = accept.parameters;

            // TODO: hack-ish... this is needed because logic in BaseAccept constructor drops the quality from the parameter set.
            if (-1 !== value.indexOf('q')) {
                parameters.q = accept.quality;
            }

            expect(parameters).to.be.deep.equal(expected);
        });
    }

    it('should build correct parameter string', () => {
        const accept = new DummyAccept('media/type; xxx = 1.0;level=2;foo=bar');
        expect(accept.normalizedValue).to.be.equal('media/type; foo=bar; level=2; xxx=1.0');
    });
});
