const Request = Jymfony.Component.HttpFoundation.Request;
const RequestMatcher = Jymfony.Component.HttpFoundation.RequestMatcher;

const expect = require('chai').expect;

describe('[HttpFoundation] RequestMatcher', function () {
    const getMethodData = function * getMethodData() {
        yield [ 'get', 'get', true ];
        yield [ 'get', [ 'get', 'post' ], true ];
        yield [ 'get', 'post', false ];
        yield [ 'get', 'GET', true ];
        yield [ 'get', [ 'GET', 'POST' ], true ];
        yield [ 'get', 'POST', false ];
    };

    let key = 0;
    for (const [ requestMethod, matcherMethod, isMatch ] of getMethodData()) {
        it('should match method with dataset #'+(key++), () => {
            const matcher = new RequestMatcher(undefined, undefined, matcherMethod);
            const request = new Request('/');
            request.method = requestMethod;

            expect(matcher.matches(request)).to.be.equal(isMatch);
        });
    }

    it('should match scheme', () => {
        const httpRequest = new Request('/');
        const httpsRequest = new Request('/', {}, {}, {}, { SCHEME: 'https' });

        let matcher = new RequestMatcher();
        expect(matcher.matches(httpRequest)).to.be.true;
        expect(matcher.matches(httpsRequest)).to.be.true;

        matcher = new RequestMatcher(undefined, undefined, undefined, [], {}, [ 'https' ]);
        expect(matcher.matches(httpRequest)).to.be.false;
        expect(matcher.matches(httpsRequest)).to.be.true;

        matcher = new RequestMatcher(undefined, undefined, undefined, [], {}, [ 'http' ]);
        expect(matcher.matches(httpRequest)).to.be.true;
        expect(matcher.matches(httpsRequest)).to.be.false;
    });

    const getHostData = function * getHostData() {
        yield [ '.*\\.example\\.com', true ];
        yield [ '\\.example\\.com$', true ];
        yield [ '^.*\\.example\\.com$', true ];
        yield [ '.*\\.sensio\\.com', false ];
        yield [ '.*\\.example\\.COM', true ];
        yield [ '\\.example\\.COM$', true ];
        yield [ '^.*\\.example\\.COM$', true ];
        yield [ '.*\\.sensio\\.COM', false ];
    };

    key = 0;
    for (const [ pattern, isMatch ] of getHostData()) {
        it('should match host with dataset #'+(key++), () => {
            const matcher = new RequestMatcher(undefined, pattern);
            const request = new Request('/', {}, {}, { HOST: 'foo.example.com' });

            expect(matcher.matches(request)).to.be.equal(isMatch);
        });
    }

    it('should match path', () => {
        let request = new Request('/admin/foo');

        let matcher = new RequestMatcher('/admin/.*');
        expect(matcher.matches(request)).to.be.true;

        matcher = new RequestMatcher('/admin');
        expect(matcher.matches(request)).to.be.true;

        matcher = new RequestMatcher('/admin/.*$');
        expect(matcher.matches(request)).to.be.true;

        matcher = new RequestMatcher('/blog/.*');
        expect(matcher.matches(request)).to.be.false;

        request = new Request('/admin/fo%20o');
        matcher = new RequestMatcher('/admin/fo o*');
        expect(matcher.matches(request)).to.be.true;
    });

    it('should match attributes', () => {
        const request = new Request('/');
        request.attributes.set('foo', 'foo_bar');

        let matcher = new RequestMatcher(undefined, undefined, undefined, [], { foo: 'foo_.*' });
        expect(matcher.matches(request)).to.be.true;
        matcher = new RequestMatcher(undefined, undefined, undefined, [], { foo: 'foo' });
        expect(matcher.matches(request)).to.be.true;
        matcher = new RequestMatcher(undefined, undefined, undefined, [], { foo: '^foo_bar$' });
        expect(matcher.matches(request)).to.be.true;
        matcher = new RequestMatcher(undefined, undefined, undefined, [], { foo: 'babar' });
        expect(matcher.matches(request)).to.be.false;
    });
});
