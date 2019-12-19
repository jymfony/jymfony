require('../../fixtures/namespace');

const Request = Jymfony.Component.HttpFoundation.Request;
const Session = Jymfony.Component.HttpFoundation.Session.Session;
const MockArraySessionStorage = Jymfony.Component.HttpFoundation.Session.Storage.MockArraySessionStorage;
const ArgumentResolver = Jymfony.Component.HttpServer.Controller.ArgumentResolver;
const ArgumentValueResolverInterface = Jymfony.Component.HttpServer.Controller.ArgumentValueResolverInterface;
const Fixtures = Jymfony.Component.HttpServer.Tests.Fixtures.ArgumentResolver;
const Prophet = Jymfony.Component.Testing.Prophet;
const { expect } = require('chai');

describe('[HttpServer] ArgumentResolverTest', function () {
    this._prophet = new Prophet();

    afterEach(() => {
        this._prophet.checkPredictions();
    });

    it ('should pass request if controller is not reflectable', async () => {
        const argumentResolver = new ArgumentResolver();
        const req = Request.create('/');

        expect(await argumentResolver.getArguments(req, () => {}))
            .to.be.deep.equal([ req ]);
    });

    it ('should call resolve on value resolvers', async () => {
        const valueResolver = this._prophet.prophesize(ArgumentValueResolverInterface);
        const req = Request.create('/');
        const resolver = new ArgumentResolver([ valueResolver.reveal() ]);

        const controller = new Fixtures.Controller();
        const reflMethod = new ReflectionClass(controller).getMethod('fooAction');

        valueResolver.supports(req, reflMethod.parameters[0])
            .shouldBeCalledTimes(1)
            .willReturn(true);
        valueResolver.resolve(req, reflMethod.parameters[0])
            .shouldBeCalledTimes(1)
            .willReturn([ req ]);

        expect(await resolver.getArguments(req, getCallableFromArray([ controller, 'fooAction' ])))
            .to.be.deep.equal([ req ]);
    });

    it ('should throw if value resolver supports parameter but does not yields any value', async () => {
        const valueResolver = this._prophet.prophesize(ArgumentValueResolverInterface);
        const req = Request.create('/');
        const resolver = new ArgumentResolver([ valueResolver.reveal() ]);

        const controller = new Fixtures.Controller();
        const reflMethod = new ReflectionClass(controller).getMethod('fooAction');

        valueResolver.supports(req, reflMethod.parameters[0])
            .shouldBeCalledTimes(1)
            .willReturn(true);
        valueResolver.resolve(req, reflMethod.parameters[0])
            .shouldBeCalledTimes(1)
            .willReturn([]);

        try {
            await resolver.getArguments(req, getCallableFromArray([ controller, 'fooAction' ]));
            throw new Error('FAIL');
        } catch (e) {
            expect(e).to.be.instanceOf(InvalidArgumentException);
        }
    });

    it ('should throw if no value resolver supports the argument', async () => {
        const valueResolver = this._prophet.prophesize(ArgumentValueResolverInterface);
        const req = Request.create('/');
        const resolver = new ArgumentResolver([ valueResolver.reveal() ]);

        const controller = new Fixtures.Controller();
        const reflMethod = new ReflectionClass(controller).getMethod('fooAction');

        valueResolver.supports(req, reflMethod.parameters[0])
            .shouldBeCalledTimes(1)
            .willReturn(false);

        try {
            await resolver.getArguments(req, getCallableFromArray([ controller, 'fooAction' ]));
            throw new Error('FAIL');
        } catch (e) {
            expect(e).to.be.instanceOf(RuntimeException);
        }
    });

    it ('should returns empty array if controller has no argument', async () => {
        const req = Request.create('/');
        const resolver = new ArgumentResolver();

        const controller = new Fixtures.Controller();

        expect(await resolver.getArguments(req, getCallableFromArray([ controller, 'controllerWithoutArguments' ])))
            .to.be.deep.equal([]);
    });

    it ('should use default values', async () => {
        const resolver = new ArgumentResolver();

        const request = Request.create('/');
        request.attributes.set('foo', 'foo');

        const controller = getCallableFromArray([ new Fixtures.Controller(), 'controllerWithFooAndDefaultBar' ]);

        expect(await resolver.getArguments(request, controller)).to.be.deep.equal([ 'foo', null ]);
    });

    it ('should use default values', async () => {
        const resolver = new ArgumentResolver();

        const request = Request.create('/');
        request.attributes.set('foo', 'foo');
        request.attributes.set('bar', 'bar');

        const controller = getCallableFromArray([ new Fixtures.Controller(), 'controllerWithFooAndDefaultBar' ]);

        expect(await resolver.getArguments(request, controller)).to.be.deep.equal([ 'foo', 'bar' ]);
    });

    it ('should get arguments from invokable object', async () => {
        const resolver = new ArgumentResolver();
        const request = Request.create('/');
        request.attributes.set('foo', 'foo');

        const controller = new Fixtures.Controller();

        expect(await resolver.getArguments(request, controller)).to.be.deep.equal([ 'foo', null ]);

        request.attributes.set('bar', 'bar');
        expect(await resolver.getArguments(request, controller)).to.be.deep.equal([ 'foo', 'bar' ]);
    });

    it ('should inject request interface', async () => {
        const resolver = new ArgumentResolver();
        const request = Request.create('/');

        const controller = getCallableFromArray([ new Fixtures.Controller(), 'controllerWithRequestInterface' ]);
        expect(await resolver.getArguments(request, controller)).to.be.deep.equal([ request ]);
    });

    it ('should inject request', async () => {
        const resolver = new ArgumentResolver();
        const request = Request.create('/');

        const controller = getCallableFromArray([ new Fixtures.Controller(), 'controllerWithRequest' ]);
        expect(await resolver.getArguments(request, controller)).to.be.deep.equal([ request ]);
    });

    it ('should inject variadic argument', async () => {
        const resolver = new ArgumentResolver();
        const request = Request.create('/');
        request.attributes.set('foo', 'foo');
        request.attributes.set('bar', [ 'foo', 'bar' ]);

        const controller = getCallableFromArray([ new Fixtures.Controller(), 'variadicAction' ]);
        expect(await resolver.getArguments(request, controller)).to.be.deep.equal([ 'foo', 'foo', 'bar' ]);
    });

    it ('should throw trying to inject variadic argument without array in request', async () => {
        const resolver = new ArgumentResolver();
        const request = Request.create('/');
        request.attributes.set('foo', 'foo');
        request.attributes.set('bar', 'bar');

        try {
            await resolver.getArguments(request, getCallableFromArray([ new Fixtures.Controller(), 'variadicAction' ]));
            throw new Error('FAIL');
        } catch (e) {
            expect(e).to.be.instanceOf(InvalidArgumentException);
        }
    });

    it ('should throw if argument is missing', async () => {
        const resolver = new ArgumentResolver();
        const request = Request.create('/');

        try {
            await resolver.getArguments(request, getCallableFromArray([ new Fixtures.Controller(), 'controllerWithFoo' ]));
            throw new Error('FAIL');
        } catch (e) {
            expect(e).to.be.instanceOf(RuntimeException);
        }
    });

    it ('should inject session', async () => {
        const resolver = new ArgumentResolver();
        const request = Request.create('/');
        request.session = new Session(new MockArraySessionStorage());

        const controller = getCallableFromArray([ new Fixtures.Controller(), 'controllerWithSession' ]);
        expect(await resolver.getArguments(request, controller)).to.be.deep.equal([ request.session ]);
    });
});
