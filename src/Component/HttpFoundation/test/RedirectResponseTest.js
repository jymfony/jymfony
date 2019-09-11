const RedirectResponse = Jymfony.Component.HttpFoundation.RedirectResponse;
const { expect } = require('chai');

describe('[HttpFoundation] RedirectResponse', function () {
    it('constructor with null url should throw', () => {
        expect(() => new RedirectResponse(null)).to.throw(InvalidArgumentException);
    });

    it('constructor with wrong status code should throw', () => {
        expect(() => new RedirectResponse('foo.bar', 404)).to.throw(InvalidArgumentException);
    });

    it('generates location header', () => {
        const response = new RedirectResponse('foo.bar');

        expect(response.headers.has('Location')).to.be.true;
        expect(response.headers.get('Location')).to.be.equal('foo.bar');
    });

    it('target url could be changed', () => {
        const response = new RedirectResponse('foo.bar');
        response.targetUrl = 'baz.beep';

        expect(response.targetUrl).to.be.equal('baz.beep');
    });

    it('set target url with null url should throw', () => {
        const response = new RedirectResponse('foo.bar');
        expect(() => response.targetUrl = null).to.throw(InvalidArgumentException);
    });

    it('should has cache headers', () => {
        let response = new RedirectResponse('foo.bar', 301);
        expect(response.headers.hasCacheControlDirective('no-cache')).to.be.false;

        response = new RedirectResponse('foo.bar', 301, { 'cache-control': 'max-age=86400' });
        expect(response.headers.hasCacheControlDirective('no-cache')).to.be.false;
        expect(response.headers.hasCacheControlDirective('max-age')).to.be.true;

        response = new RedirectResponse('foo.bar', 302);
        expect(response.headers.hasCacheControlDirective('no-cache')).to.be.true;
    });
});
