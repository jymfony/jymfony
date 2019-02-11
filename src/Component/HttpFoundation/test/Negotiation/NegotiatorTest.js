const Accept = Jymfony.Component.HttpFoundation.Negotiation.Accept;
const Match = Jymfony.Component.HttpFoundation.Negotiation.Match;
const Negotiator = Jymfony.Component.HttpFoundation.Negotiation.Negotiator;
const Exception = Jymfony.Component.HttpFoundation.Negotiation.Exception;
const expect = require('chai').expect;

describe('[HttpFoundation] Negotiator', function () {
    const pearAcceptHeader = 'text/html,application/xhtml+xml,application/xml;q=0.9,text/*;q=0.7,*/*,image/gif; q=0.8, image/jpeg; q=0.6, image/*';
    const rfcHeader = 'text/*;q=0.3, text/html;q=0.7, text/html;level=1, text/html;level=2;q=0.4, */*;q=0.5';

    const testsForGetBest = [
        // Exceptions
        [ '/qwer', [ 'f/g' ], null ],
        [ '/qwer,f/g', [ 'f/g' ], [ 'f/g', { } ] ],
        [ 'foo/bar', [ '/qwer' ], new Exception.InvalidMediaTypeException() ],
        [ '', [ 'foo/bar' ], new Exception.InvalidArgumentException('The header string should not be empty.') ],
        [ '*/*', [ ], new Exception.InvalidArgumentException('A set of server priorities should be given.') ],

        // See: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
        [ rfcHeader, [ 'text/html;level=1' ], [ 'text/html', { 'level': '1' } ] ],
        [ rfcHeader, [ 'text/html' ], [ 'text/html', { } ] ],
        [ rfcHeader, [ 'text/plain' ], [ 'text/plain', { } ] ],
        [ rfcHeader, [ 'image/jpeg' ], [ 'image/jpeg', { } ] ],
        [ rfcHeader, [ 'text/html;level=2' ], [ 'text/html', { 'level': '2' } ] ],
        [ rfcHeader, [ 'text/html;level=3' ], [ 'text/html', { 'level': '3' } ] ],
        [ 'text/*;q=0.7, text/html;q=0.3, */*;q=0.5, image/png;q=0.4', [ 'text/html', 'image/png' ], [ 'image/png', { } ] ],
        [ 'image/png;q=0.1, text/plain, audio/ogg;q=0.9', [ 'image/png', 'text/plain', 'audio/ogg' ], [ 'text/plain', { } ] ],
        [ 'image/png, text/plain, audio/ogg', [ 'baz/asdf' ], null ],
        [ 'image/png, text/plain, audio/ogg', [ 'audio/ogg' ], [ 'audio/ogg', { } ] ],
        [ 'image/png, text/plain, audio/ogg', [ 'YO/SuP' ], null ],
        [ 'text/html; charset=UTF-8, application/pdf', [ 'text/html; charset=UTF-8' ], [ 'text/html', { 'charset': 'UTF-8' } ] ],
        [ 'text/html; charset=UTF-8, application/pdf', [ 'text/html' ], null ],
        [ 'text/html, application/pdf', [ 'text/html; charset=UTF-8' ], [ 'text/html', { 'charset': 'UTF-8' } ] ],

        // PEAR HTTP2 tests - have been altered from original!
        [ pearAcceptHeader, [ 'image/gif', 'image/png', 'application/xhtml+xml', 'application/xml', 'text/html', 'image/jpeg', 'text/plain' ], [ 'image/png', { } ] ],
        [ pearAcceptHeader, [ 'image/gif', 'application/xhtml+xml', 'application/xml', 'image/jpeg', 'text/plain' ], [ 'application/xhtml+xml', { } ] ],
        [ pearAcceptHeader, [ 'image/gif', 'application/xml', 'image/jpeg', 'text/plain' ], [ 'application/xml', { } ] ],
        [ pearAcceptHeader, [ 'image/gif', 'image/jpeg', 'text/plain' ], [ 'image/gif', { } ] ],
        [ pearAcceptHeader, [ 'text/plain', 'image/png', 'image/jpeg' ], [ 'image/png', { } ] ],
        [ pearAcceptHeader, [ 'image/jpeg', 'image/gif' ], [ 'image/gif', { } ] ],
        [ pearAcceptHeader, [ 'image/png' ], [ 'image/png', { } ] ],
        [ pearAcceptHeader, [ 'audio/midi' ], [ 'audio/midi', { } ] ],
        [ 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', [ 'application/rss+xml' ], [ 'application/rss+xml', { } ] ],

        // LWS / case sensitivity
        [ 'text/* ; q=0.3, TEXT/html ;Q=0.7, text/html ; level=1, texT/Html ;leVel = 2 ;q=0.4, */* ; q=0.5', [ 'text/html; level=2' ], [ 'text/html', { 'level': '2' } ] ],
        [ 'text/* ; q=0.3, text/html;Q=0.7, text/html ;level=1, text/html; level=2;q=0.4, */*;q=0.5', [ 'text/HTML; level=3' ], [ 'text/html', { 'level': '3' } ] ],

        // Incompatible
        [ 'text/html', [ 'application/rss' ], null ],

        // IE8 Accept header
        [ 'image/jpeg, application/x-ms-application, image/gif, application/xaml+xml, image/pjpeg, application/x-ms-xbap, */*', [ 'text/html', 'application/xhtml+xml' ], [ 'text/html', { } ] ],

        // Quality of source factors
        [ rfcHeader, [ 'text/html;q=0.4', 'text/plain' ], [ 'text/plain', { } ] ],

        // Wildcard "plus" parts (e.g., application/vnd.api+json)
        [ 'application/vnd.api+json', [ 'application/json', 'application/*+json' ], [ 'application/*+json', { } ] ],
        [ 'application/json;q=0.7, application/*+json;q=0.7', [ 'application/hal+json', 'application/problem+json' ], [ 'application/hal+json', { } ] ],
        [ 'application/json;q=0.7, application/problem+*;q=0.7', [ 'application/hal+xml', 'application/problem+xml' ], [ 'application/problem+xml', { } ] ],
        [ pearAcceptHeader, [ 'application/*+xml' ], [ 'application/*+xml', { } ] ],

        [ 'application/hal+json', [ 'application/ld+json', 'application/hal+json', 'application/xml', 'text/xml', 'application/json', 'text/html' ], [ 'application/hal+json', { } ] ],
    ];

    for (const [ header, priorities, expected ] of testsForGetBest) {
        it('getBest should work correctly', () => {
            const negotiator = new Negotiator();
            let acceptHeader;

            try {
                acceptHeader = negotiator.getBest(header, priorities);
            } catch (e) {
                if (! (e instanceof Exception.ExceptionInterface)) {
                    throw e;
                }

                expect(ReflectionClass.getClassName(e)).to.be.equal(ReflectionClass.getClassName(expected));
                expect(e.message).to.be.equal(expected.message);

                return;
            }

            if (null === acceptHeader) {
                expect(expected).to.be.null;

                return;
            }

            expect(acceptHeader).to.be.instanceOf(Accept);

            expect(acceptHeader.type).to.be.equal(expected[0]);
            expect(acceptHeader.parameters).to.be.deep.equal(expected[1]);
        });
    }

    const testsForGetOrderedElements = [
        // Error cases
        [ '', new Exception.InvalidArgumentException('The header string should not be empty.') ],
        [ '/qwer', null ],

        // First one wins as no quality modifiers
        [ 'text/html, text/xml', [ 'text/html', 'text/xml' ] ],

        // Ordered by quality modifier
        [
            'text/html;q=0.3, text/html;q=0.7',
            [ 'text/html;q=0.7', 'text/html;q=0.3' ],
        ],

        // Ordered by quality modifier - the one with no modifier wins, level not taken into account
        [
            'text/*;q=0.3, text/html;q=0.7, text/html;level=1, text/html;level=2;q=0.4, */*;q=0.5',
            [ 'text/html;level=1', 'text/html;q=0.7', '*/*;q=0.5', 'text/html;level=2;q=0.4', 'text/*;q=0.3' ],
        ],
    ];

    for (const [ header, expected ] of testsForGetOrderedElements) {
        it('getOrderedElements should work correctly', () => {
            const negotiator = new Negotiator();
            let elements;

            try {
                elements = negotiator.getOrderedElements(header);
            } catch (e) {
                if (! (e instanceof Exception.ExceptionInterface)) {
                    throw e;
                }

                expect(ReflectionClass.getClassName(e)).to.be.equal(ReflectionClass.getClassName(expected));
                expect(e.message).to.be.equal(expected.message);

                return;
            }

            if (0 === elements.length) {
                expect(expected).to.be.null;

                return;
            }

            expect(elements[0]).to.be.instanceOf(Accept);

            for (const [ key, item ] of __jymfony.getEntries(expected)) {
                expect(elements[key].value).to.be.equal(item);
            }
        });
    }

    it('getBest should respect quality of source', () => {
        const negotiator = new Negotiator();
        const accept = negotiator.getBest('text/html,text/*;q=0.7', [ 'text/html;q=0.5', 'text/plain;q=0.9' ]);

        expect(accept).to.be.instanceOf(Accept);
        expect(accept.type).to.be.equal('text/plain');
    });

    it('should throw on invalid media type', () => {
        const negotiator = new Negotiator();

        expect(negotiator.getBest.bind(negotiator, 'sdlfkj20ff; wdf', [ 'foo/qwer' ], true))
            .to.throw(Exception.InvalidMediaTypeException);
    });

    const testForFindMatches = [
        [
            [ new Accept('text/html; charset=UTF-8'), new Accept('image/png; foo=bar; q=0.7'), new Accept('*/*; foo=bar; q=0.4') ],
            [ new Accept('text/html; charset=UTF-8'), new Accept('image/png; foo=bar'), new Accept('application/pdf') ],
            [
                new Match(1.0, 111, 0),
                new Match(0.7, 111, 1),
                new Match(0.4, 1, 1),
            ],
        ],
        [
            [ new Accept('text/html'), new Accept('image/*; q=0.7') ],
            [ new Accept('text/html; asfd=qwer'), new Accept('image/png'), new Accept('application/pdf') ],
            [
                new Match(1.0, 110, 0),
                new Match(0.7, 100, 1),
            ],
        ],
        [ // https://tools.ietf.org/html/rfc7231#section-5.3.2
            [ new Accept('text/*; q=0.3'), new Accept('text/html; q=0.7'), new Accept('text/html; level=1'), new Accept('text/html; level=2; q=0.4'), new Accept('*/*; q=0.5') ],
            [ new Accept('text/html; level=1'), new Accept('text/html'), new Accept('text/plain'), new Accept('image/jpeg'), new Accept('text/html; level=2'), new Accept('text/html; level=3') ],
            [
                new Match(0.3, 100, 0),
                new Match(0.7, 110, 0),
                new Match(1.0, 111, 0),
                new Match(0.5, 0, 0),
                new Match(0.3, 100, 1),
                new Match(0.7, 110, 1),
                new Match(0.5, 0, 1),
                new Match(0.3, 100, 2),
                new Match(0.5, 0, 2),
                new Match(0.5, 0, 3),
                new Match(0.3, 100, 4),
                new Match(0.7, 110, 4),
                new Match(0.4, 111, 4),
                new Match(0.5, 0, 4),
                new Match(0.3, 100, 5),
                new Match(0.7, 110, 5),
                new Match(0.5, 0, 5),
            ],
        ],
    ];

    for (const [ headerParts, priorities, expected ] of testForFindMatches) {
        it('should find matches', () => {
            const negotiator = new Negotiator();
            expect(negotiator._findMatches(headerParts, priorities))
                .to.be.deep.equal(expected);
        });
    }
});
