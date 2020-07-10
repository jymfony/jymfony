const Request = Jymfony.Component.HttpFoundation.Request;
const MethodNotAllowedException = Jymfony.Component.Routing.Exception.MethodNotAllowedException;
const NoConfigurationException = Jymfony.Component.Routing.Exception.NoConfigurationException;
const ResourceNotFoundException = Jymfony.Component.Routing.Exception.ResourceNotFoundException;
const Matcher = Jymfony.Component.Routing.Matcher.Matcher;
const RouteCollection = Jymfony.Component.Routing.RouteCollection;
const Route = Jymfony.Component.Routing.Route;
const { expect } = require('chai');

exports.MatcherTest = function () {
    it('no method, allowed', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('foo', new Route('/foo'));

        expect(this._getMatcher(routeCollection).matchRequest(Request.create('http://localhost/foo')))
            .to.be.deep.equal({ _route: 'foo' });
    });

    it('method not allowed', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('foo', new Route('/foo', {}, {}, {}, undefined, [], [ 'POST' ]));

        const matcher = this._getMatcher(routeCollection);

        expect(() => matcher.matchRequest(Request.create('http://localhost/foo')))
            .to.throw(MethodNotAllowedException);
    });

    it('method not allowed on root', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('foo', new Route('/', {}, {}, {}, undefined, [], [ 'GET' ]));

        const matcher = this._getMatcher(routeCollection);
        let caught;

        try {
            matcher.matchRequest(Request.create('http://localhost/', 'POST'));
        } catch (e) {
            caught = e;
        }

        expect(caught).to.be.instanceOf(MethodNotAllowedException);
        expect(caught.allowedMethods).to.be.deep.equal([ 'GET' ]);
    });

    it('HEAD method allowed on GET', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('foo', new Route('/', {}, {}, {}, undefined, [], [ 'GET' ]));

        const matcher = this._getMatcher(routeCollection);

        expect(matcher.matchRequest(Request.create('http://localhost/', 'HEAD')))
            .to.be.deep.equal({ _route: 'foo' });
    });

    it('aggregates allowed methods', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('foo', new Route('/foo', {}, {}, {}, undefined, [], [ 'POST' ]));
        routeCollection.add('foo_1', new Route('/foo', {}, {}, {}, undefined, [], [ 'PUT', 'DELETE' ]));

        const matcher = this._getMatcher(routeCollection);
        let caught;

        try {
            matcher.matchRequest(Request.create('http://localhost/foo', 'GET'));
        } catch (e) {
            caught = e;
        }

        expect(caught).to.be.instanceOf(MethodNotAllowedException);
        expect(caught.allowedMethods).to.be.deep.equal([ 'POST', 'PUT', 'DELETE' ]);
    });

    it('match request should work', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('foo', new Route('/foo/{bar}'));

        const matcher = this._getMatcher(routeCollection);
        let caught;
        try {
            matcher.matchRequest(Request.create('http://localhost/no-match'));
        } catch (e) {
            caught = e;
        }

        expect(caught).to.be.instanceOf(ResourceNotFoundException);
        expect(matcher.matchRequest(Request.create('http://localhost/foo/baz')))
            .to.be.deep.equal({ _route: 'foo', bar: 'baz' });
    });

    it('defaults are merged', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('foo', new Route('/foo/{bar}', { def: 'test' }));

        const matcher = this._getMatcher(routeCollection);
        expect(matcher.matchRequest(Request.create('http://localhost/foo/baz')))
            .to.be.deep.equal({ _route: 'foo', bar: 'baz', def: 'test' });
    });

    it('optional value as first segment', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('foo', new Route('/{bar}/foo', { bar: 'bar' }, { bar: 'foo|bar' }));

        const matcher = this._getMatcher(routeCollection);
        expect(matcher.matchRequest(Request.create('http://localhost/bar/foo')))
            .to.be.deep.equal({ _route: 'foo', bar: 'bar' });
        expect(matcher.matchRequest(Request.create('http://localhost/foo/foo')))
            .to.be.deep.equal({ _route: 'foo', bar: 'foo' });
    });

    it('only optional values', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('foo', new Route('/{bar}/{foo}', { bar: 'bar', foo: 'foo' }));

        const matcher = this._getMatcher(routeCollection);
        expect(matcher.matchRequest(Request.create('http://localhost/')))
            .to.be.deep.equal({ _route: 'foo', bar: 'bar', foo: 'foo' });
        expect(matcher.matchRequest(Request.create('http://localhost/a')))
            .to.be.deep.equal({ _route: 'foo', bar: 'a', foo: 'foo' });
        expect(matcher.matchRequest(Request.create('http://localhost/a/b')))
            .to.be.deep.equal({ _route: 'foo', bar: 'a', foo: 'b' });
    });

    it('collection prefixes', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('foo', new Route('/{foo}'));
        routeCollection.addPrefix('/b');
        routeCollection.addPrefix('/a');

        const matcher = this._getMatcher(routeCollection);
        expect(matcher.matchRequest(Request.create('http://localhost/a/b/foo')))
            .to.be.deep.equal({ _route: 'foo', foo: 'foo' });
    });

    it('variable prefix', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('foo', new Route('/{foo}'));
        routeCollection.addPrefix('/b');
        routeCollection.addPrefix('/{_locale}');

        const matcher = this._getMatcher(routeCollection);
        expect(matcher.matchRequest(Request.create('http://localhost/fr/b/foo')))
            .to.be.deep.equal({ _route: 'foo', _locale: 'fr', foo: 'foo' });
    });

    it('trailing encoded newline is not overlooked', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('foo', new Route('/foo'));

        const matcher = this._getMatcher(routeCollection);

        expect(() => matcher.matchRequest(Request.create('http://localhost/foo%0A')))
            .to.throw(ResourceNotFoundException);
    });

    it('dot metacharacter in requirements', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('foo', new Route('/{foo}/bar', {}, { foo: /(.|\n)+/ }));

        const matcher = this._getMatcher(routeCollection);

        expect(matcher.matchRequest(Request.create('http://localhost/%0A/bar')))
            .to.be.deep.equal({ _route: 'foo', foo: '\n' });
        expect(matcher.matchRequest(Request.create('http://localhost/foobar/bar')))
            .to.be.deep.equal({ _route: 'foo', foo: 'foobar' });
    });

    it('requirement with capturing group', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('a', new Route('/{a}/{b}', {}, { a: /(a|b)/ }));

        const matcher = this._getMatcher(routeCollection);
        expect(matcher.matchRequest(Request.create('http://localhost/a/b')))
            .to.be.deep.equal({ _route: 'a', a: 'a', b: 'b' });
    });

    it('match overridden route', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('foo', new Route('/foo'));
        routeCollection.add('foo', new Route('/foo1'));

        const matcher = this._getMatcher(routeCollection);

        expect(matcher.matchRequest(Request.create('http://localhost/foo1')))
            .to.be.deep.equal({ _route: 'foo' });
        expect(() => matcher.matchRequest(Request.create('http://localhost/foo')))
            .to.throw(ResourceNotFoundException);
    });

    it('match regression', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('foo', new Route('/foo/{foo}'));
        routeCollection.add('bar', new Route('/foo/bar/{foo}'));

        const matcher = this._getMatcher(routeCollection);

        expect(matcher.matchRequest(Request.create('http://localhost/foo/bar/bar')))
            .to.be.deep.equal({ _route: 'bar', foo: 'bar' });
    });

    it('multiple params', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('foo1', new Route('/foo/{a}/{b}'));
        routeCollection.add('foo2', new Route('/foo/{a}/test/test/{b}'));
        routeCollection.add('foo3', new Route('/foo/{a}/{b}/{c}/{d}'));

        const matcher = this._getMatcher(routeCollection);

        expect(matcher.matchRequest(Request.create('http://localhost/foo/test/test/test/bar')))
            .to.be.deep.equal({ _route: 'foo2', a: 'test', b: 'bar' });
    });

    it('matching is eager', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('test', new Route('/{foo}-{bar}-', {}, { foo: '.+', bar: '.+' }));
        const matcher = this._getMatcher(routeCollection);

        expect(matcher.matchRequest(Request.create('http://localhost/text1-text2-text3-text4-')))
            .to.be.deep.equal({ _route: 'test', foo: 'text1-text2-text3', bar: 'text4' });
    });

    it('adjacent variables', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('test', new Route('/{w}{x}{y}{z}.{_format}', { z: 'default-z', _format: 'html' }, { y: /y|Y/ }));
        const matcher = this._getMatcher(routeCollection);

        expect(matcher.matchRequest(Request.create('http://localhost/wwwwwxYZ.xml')))
            .to.be.deep.equal({ _route: 'test', w: 'wwwww', x: 'x', y: 'Y', z: 'Z', _format: 'xml' });
        expect(matcher.matchRequest(Request.create('http://localhost/wwwwwxYZZZ')))
            .to.be.deep.equal({ _route: 'test', w: 'wwwww', x: 'x', y: 'Y', z: 'ZZZ', _format: 'html' });
        expect(matcher.matchRequest(Request.create('http://localhost/wwwwwxy')))
            .to.be.deep.equal({ _route: 'test', w: 'wwwww', x: 'x', y: 'y', z: 'default-z', _format: 'html' });

        expect(() => matcher.matchRequest(Request.create('http://localhost/wxy.html')))
            .to.throw(ResourceNotFoundException);
    });

    it('no real separator', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('test', new Route('/get{what}', { what: 'All' }));
        const matcher = this._getMatcher(routeCollection);

        expect(matcher.matchRequest(Request.create('http://localhost/get')))
            .to.be.deep.equal({ _route: 'test', what: 'All' });
        expect(matcher.matchRequest(Request.create('http://localhost/getSites')))
            .to.be.deep.equal({ _route: 'test', what: 'Sites' });

        expect(() => matcher.matchRequest(Request.create('http://localhost/ge')))
            .to.throw(ResourceNotFoundException);
    });

    it('no real separator required variable', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('test', new Route('/get{what}Suffix'));
        const matcher = this._getMatcher(routeCollection);

        expect(matcher.matchRequest(Request.create('http://localhost/getSitesSuffix')))
            .to.be.deep.equal({ _route: 'test', what: 'Sites' });
    });

    it('requirements disallow slashes', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('test', new Route('/{page}.{_format}'));
        const matcher = this._getMatcher(routeCollection);

        expect(() => matcher.matchRequest(Request.create('http://localhost/index.sl/ash')))
            .to.throw(ResourceNotFoundException);
    });

    it('requirements disallow next separator', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('test', new Route('/{page}.{_format}', {}, { _format: 'html|xml' }));
        const matcher = this._getMatcher(routeCollection);

        expect(() => matcher.matchRequest(Request.create('http://localhost/do.t.html')))
            .to.throw(ResourceNotFoundException);
    });

    it('missing trailing slash', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('test', new Route('/foo/'));
        const matcher = this._getMatcher(routeCollection);

        expect(() => matcher.matchRequest(Request.create('http://localhost/foo')))
            .to.throw(ResourceNotFoundException);
    });

    it('extra trailing slash', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('test', new Route('/foo'));
        const matcher = this._getMatcher(routeCollection);

        expect(() => matcher.matchRequest(Request.create('http://localhost/foo/')))
            .to.throw(ResourceNotFoundException);
    });

    it('scheme requirement', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('test', new Route('/foo', {}, {}, {}, undefined, [ 'https' ]));
        const matcher = this._getMatcher(routeCollection);

        expect(matcher.matchRequest(Request.create('https://localhost/foo')))
            .to.be.deep.equal({ _route: 'test' });
        expect(() => matcher.matchRequest(Request.create('http://localhost/foo')))
            .to.throw(ResourceNotFoundException);
    });

    it('decode once', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('test', new Route('/foo/{foo}'));
        const matcher = this._getMatcher(routeCollection);

        expect(matcher.matchRequest(Request.create('http://localhost/foo/foo%2523')))
            .to.be.deep.equal({ _route: 'test', foo: 'foo%23' });
    });

    it('with host', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('test', new Route('/foo/{foo}', {}, {}, {}, '{locale}.example.com'));
        const matcher = this._getMatcher(routeCollection);

        expect(matcher.matchRequest(Request.create('http://en.example.com/foo/bar')))
            .to.be.deep.equal({ _route: 'test', locale: 'en', foo: 'bar' });
    });

    it('host does not match', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('test', new Route('/foo', {}, {}, {}, '{locale}.example.com'));
        const matcher = this._getMatcher(routeCollection);

        expect(() => matcher.matchRequest(Request.create('http://example.com/foo')))
            .to.throw(ResourceNotFoundException);
    });

    it('path is case sensitive', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('test', new Route('/{locale}', {}, { locale: 'EN|FR|DE' }));
        const matcher = this._getMatcher(routeCollection);

        expect(() => matcher.matchRequest(Request.create('http://localhost/en')))
            .to.throw(ResourceNotFoundException);
    });

    it('host is case insensitive', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('test', new Route('/foo', {}, { locale: 'EN|FR|DE' }, {}, '{locale}.example.com'));
        const matcher = this._getMatcher(routeCollection);

        expect(matcher.matchRequest(Request.create('http://en.example.com/foo')))
            .to.be.deep.equal({ _route: 'test', locale: 'en' });
    });

    it('no configuration', () => {
        const matcher = this._getMatcher(new RouteCollection());

        expect(() => matcher.matchRequest(Request.create('http://en.example.com/')))
            .to.throw(NoConfigurationException);
    });

    it('nested collection', () => {
        const collection = new RouteCollection();

        let subCollection = new RouteCollection();
        subCollection.add('a', new Route('/a'));
        subCollection.add('b', new Route('/b'));
        subCollection.add('c', new Route('/c'));
        subCollection.addPrefix('/p');

        collection.addCollection(subCollection);
        collection.add('baz', new Route('/{baz}'));

        subCollection = new RouteCollection();
        subCollection.add('buz', new Route('/buz'));
        subCollection.addPrefix('/prefix');

        collection.addCollection(subCollection);

        const matcher = this._getMatcher(collection);

        expect(matcher.matchRequest(Request.create('http://localhost/p/a'))).to.be.deep.equal({ _route: 'a' });
        expect(matcher.matchRequest(Request.create('http://localhost/p'))).to.be.deep.equal({ _route: 'baz', baz: 'p' });
        expect(matcher.matchRequest(Request.create('http://localhost/prefix/buz'))).to.be.deep.equal({ _route: 'buz' });
    });

    it('scheme and method mismatch', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('test', new Route('/', {}, {}, {}, undefined, [ 'https' ], [ 'POST' ]));
        const matcher = this._getMatcher(routeCollection);

        expect(() => matcher.matchRequest(Request.create('http://localhost/')))
            .to.throw(ResourceNotFoundException);
    });

    it('should match request with forced route parameter', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('foo', new Route('/foo/{!bar}'));

        const matcher = this._getMatcher(routeCollection);
        expect(matcher.matchRequest(Request.create('http://localhost/foo/baz')))
            .to.be.deep.equal({ _route: 'foo', bar: 'baz' });
    });

    it('should match request when more than one route has similar regexes', () => {
        const routeCollection = new RouteCollection();
        routeCollection.add('foo', new Route('/foo/{id}', {}, {}, {}, undefined, [], [ 'GET' ]));
        routeCollection.add('foo2', new Route('/foo/{id}', {}, {}, {}, undefined, [], [ 'POST' ]));
        routeCollection.add('foo3', new Route('/foo/{px}', {}, {}, {}, undefined, [], [ 'PATCH' ]));
        routeCollection.add('foo4', new Route('/foo/{id}', {}, {}, {}, undefined, [], [ 'DELETE' ]));
        routeCollection.add('foo5', new Route('/foo/{pts}', {}, {}, {}, undefined, [], [ 'PUT' ]));
        routeCollection.add('bar1', new Route('/bar/{id}', {}, {}, {}, undefined, [], [ 'GET' ]));
        routeCollection.add('bar2', new Route('/bar/{id}', {}, {}, {}, undefined, [], [ 'POST' ]));
        routeCollection.add('foo6', new Route('/foo/{id}', {}, {}, {}, undefined, [], [ 'CUSTOM' ]));

        const matcher = this._getMatcher(routeCollection);
        expect(matcher.matchRequest(Request.create('http://localhost/foo/baz'))).to.be.deep.equal({ _route: 'foo', id: 'baz' });
        expect(matcher.matchRequest(Request.create('http://localhost/foo/baz', Request.METHOD_POST))).to.be.deep.equal({ _route: 'foo2', id: 'baz' });
        expect(matcher.matchRequest(Request.create('http://localhost/foo/baz', Request.METHOD_PATCH))).to.be.deep.equal({ _route: 'foo3', px: 'baz' });
        expect(matcher.matchRequest(Request.create('http://localhost/foo/baz', Request.METHOD_DELETE))).to.be.deep.equal({ _route: 'foo4', id: 'baz' });
        expect(matcher.matchRequest(Request.create('http://localhost/foo/baz', Request.METHOD_PUT))).to.be.deep.equal({ _route: 'foo5', pts: 'baz' });
        expect(matcher.matchRequest(Request.create('http://localhost/foo/baz', 'CUSTOM'))).to.be.deep.equal({ _route: 'foo6', id: 'baz' });
        expect(() => matcher.matchRequest(Request.create('http://localhost/boo/baz'))).to.throw(ResourceNotFoundException);
    });

    /**
     * Gets a request matcher.
     *
     * @param {Jymfony.Component.Routing.RouteCollection} routes
     *
     * @returns {Jymfony.Component.Routing.Matcher.Matcher}
     *
     * @private
     */
    this._getMatcher = (routes) => {
        return new Matcher(routes);
    };
};

describe('[Routing] MatcherTest', exports.MatcherTest);
