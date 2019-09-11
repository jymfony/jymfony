const Accept = Jymfony.Component.HttpFoundation.Negotiation.Accept;
const { expect } = require('chai');

describe('[HttpFoundation] Accept', function () {
    it('get parameter should work', () => {
        const accept = new Accept('foo/bar; q=1; hello=world');

        expect(accept.hasParameter('hello')).to.be.true;
        expect(accept.getParameter('hello')).to.be.equal('world');
        expect(accept.hasParameter('unknown')).to.be.false;
        expect(accept.getParameter('unknown')).to.be.undefined;
        expect(accept.getParameter('unknown', false)).to.be.false;
        expect(accept.getParameter('hello', 'goodbye')).to.be.equal('world');
    });

    const testsForGetNormalizedValue = [
        [ 'text/html; z=y; a=b; c=d', 'text/html; a=b; c=d; z=y' ],
        [ 'application/pdf; q=1; param=p', 'application/pdf; param=p' ],
    ];

    for (const [ header, expected ] of testsForGetNormalizedValue) {
        it('get normalized value', () => {
            const accept = new Accept(header);
            expect(accept.normalizedValue).to.be.equal(expected);
        });
    }

    const testsForGetType = [
        [ 'text/html;hello=world', 'text/html' ],
        [ 'application/pdf', 'application/pdf' ],
        [ 'application/xhtml+xml;q=0.9', 'application/xhtml+xml' ],
        [ 'text/plain; q=0.5', 'text/plain' ],
        [ 'text/html;level=2;q=0.4', 'text/html' ],
        [ 'text/html ; level = 2   ; q = 0.4', 'text/html' ],
        [ 'text/*', 'text/*' ],
        [ 'text/* ;q=1 ;level=2', 'text/*' ],
        [ '*/*', '*/*' ],
        [ '*', '*/*' ],
        [ '*/* ; param=555', '*/*' ],
        [ '* ; param=555', '*/*' ],
        [ 'TEXT/hTmL;leVel=2; Q=0.4', 'text/html' ],
    ];

    for (const [ header, expected ] of testsForGetType) {
        it('get type', () => {
            const accept = new Accept(header);
            expect(accept.type).to.be.equal(expected);
        });
    }

    const testsForGetValue = [
        [ 'text/html;hello=world  ;q=0.5', 'text/html;hello=world  ;q=0.5' ],
        [ 'application/pdf', 'application/pdf' ],
    ];

    for (const [ header, expected ] of testsForGetValue) {
        it('get value', () => {
            const accept = new Accept(header);
            expect(accept.value).to.be.equal(expected);
        });
    }
});
