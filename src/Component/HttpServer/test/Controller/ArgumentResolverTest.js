const Request = Jymfony.Component.HttpFoundation.Request;
const Session = Jymfony.Component.HttpFoundation.Session.Session;
const MockArraySessionStorage = Jymfony.Component.HttpFoundation.Session.Storage.MockArraySessionStorage;
const ArgumentResolver = Jymfony.Component.HttpServer.Controller.ArgumentResolver;
const ArgumentValueResolverInterface = Jymfony.Component.HttpServer.Controller.ArgumentValueResolverInterface;
const ControllerArgumentMetadata = Jymfony.Component.HttpServer.Controller.Metadata.ControllerArgumentMetadata;
const Fixtures = Jymfony.Component.HttpServer.Tests.Fixtures.ArgumentResolver;
const Argument = Jymfony.Component.Testing.Argument.Argument;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class ArgumentResolverTest extends TestCase {
    get testCaseName() {
        return '[HttpServer] ' + super.testCaseName;
    }

    async testShouldPassRequestIfControllerIsNotReflectable() {
        const argumentResolver = new ArgumentResolver();
        const req = Request.create('/');

        __self.assertEquals([ req ], await argumentResolver.getArguments(req, () => {}));
    }

    async testShouldCallResolveOnValueResolvers() {
        const valueResolver = this.prophesize(ArgumentValueResolverInterface);
        const req = Request.create('/');
        const resolver = new ArgumentResolver(null, [ valueResolver.reveal() ]);

        const controller = new Fixtures.Controller();

        valueResolver.supports(req, Argument.type(ControllerArgumentMetadata))
            .shouldBeCalledTimes(1)
            .willReturn(true);
        valueResolver.resolve(req, Argument.type(ControllerArgumentMetadata))
            .shouldBeCalledTimes(1)
            .willReturn([ req ]);

        __self.assertEquals([ req ], await resolver.getArguments(req, getCallableFromArray([ controller, 'fooAction' ])));
    }

    async testShouldThrowIfValueResolverSupportsParameterButDoesNotYieldsAnyValue() {
        const valueResolver = this.prophesize(ArgumentValueResolverInterface);
        const req = Request.create('/');
        const resolver = new ArgumentResolver(null, [ valueResolver.reveal() ]);

        const controller = new Fixtures.Controller();
        valueResolver.supports(req, Argument.type(ControllerArgumentMetadata))
            .shouldBeCalledTimes(1)
            .willReturn(true);
        valueResolver.resolve(req, Argument.type(ControllerArgumentMetadata))
            .shouldBeCalledTimes(1)
            .willReturn([]);

        this.expectException(InvalidArgumentException);
        await resolver.getArguments(req, getCallableFromArray([ controller, 'fooAction' ]));
    }

    async testShouldThrowIfNoValueResolverSupportsTheArgument() {
        const valueResolver = this.prophesize(ArgumentValueResolverInterface);
        const req = Request.create('/');
        const resolver = new ArgumentResolver(null, [ valueResolver.reveal() ]);

        const controller = new Fixtures.Controller();
        valueResolver.supports(req, Argument.type(ControllerArgumentMetadata))
            .shouldBeCalledTimes(1)
            .willReturn(false);

        this.expectException(RuntimeException);
        await resolver.getArguments(req, getCallableFromArray([ controller, 'fooAction' ]));
    }

    async testShouldReturnsEmptyArrayIfControllerHasNoArgument() {
        const req = Request.create('/');
        const resolver = new ArgumentResolver();

        const controller = new Fixtures.Controller();

        __self.assertEquals([], await resolver.getArguments(req, getCallableFromArray([ controller, 'controllerWithoutArguments' ])));
    }

    async testShouldUseDefaultValues() {
        const resolver = new ArgumentResolver();

        const request = Request.create('/');
        request.attributes.set('foo', 'foo');

        const controller = getCallableFromArray([ new Fixtures.Controller(), 'controllerWithFooAndDefaultBar' ]);

        __self.assertEquals([ 'foo', undefined ], await resolver.getArguments(request, controller));
    }

    async testShouldUseRequestValues() {
        const resolver = new ArgumentResolver();

        const request = Request.create('/');
        request.attributes.set('foo', 'foo');
        request.attributes.set('bar', 'bar');

        const controller = getCallableFromArray([ new Fixtures.Controller(), 'controllerWithFooAndDefaultBar' ]);

        __self.assertEquals([ 'foo', 'bar' ], await resolver.getArguments(request, controller));
    }

    async testShouldGetArgumentsFromInvokableObject() {
        const resolver = new ArgumentResolver();
        const request = Request.create('/');
        request.attributes.set('foo', 'foo');

        const controller = new Fixtures.Controller();

        __self.assertEquals([ 'foo', undefined ], await resolver.getArguments(request, controller));

        request.attributes.set('bar', 'bar');
        __self.assertEquals([ 'foo', 'bar' ], await resolver.getArguments(request, controller));
    }

    async testShouldInjectRequestInterface() {
        const resolver = new ArgumentResolver();
        const request = Request.create('/');

        const controller = getCallableFromArray([ new Fixtures.Controller(), 'controllerWithRequestInterface' ]);
        __self.assertEquals([ request ], await resolver.getArguments(request, controller));
    }

    async testShouldInjectRequest() {
        const resolver = new ArgumentResolver();
        const request = Request.create('/');

        const controller = getCallableFromArray([ new Fixtures.Controller(), 'controllerWithRequest' ]);
        __self.assertEquals([ request ], await resolver.getArguments(request, controller));
    }

    async testShouldInjectVariadicArgument() {
        const resolver = new ArgumentResolver();
        const request = Request.create('/');
        request.attributes.set('foo', 'foo');
        request.attributes.set('bar', [ 'foo', 'bar' ]);

        const controller = getCallableFromArray([ new Fixtures.Controller(), 'variadicAction' ]);
        __self.assertEquals([ 'foo', 'foo', 'bar' ], await resolver.getArguments(request, controller));
    }

    async testShouldThrowTryingToInjectVariadicArgumentWithoutArrayInRequest() {
        const resolver = new ArgumentResolver();
        const request = Request.create('/');
        request.attributes.set('foo', 'foo');
        request.attributes.set('bar', 'bar');

        this.expectException(InvalidArgumentException);
        await resolver.getArguments(request, getCallableFromArray([ new Fixtures.Controller(), 'variadicAction' ]));
    }

    async testShouldThrowIfArgumentIsMissing() {
        const resolver = new ArgumentResolver();
        const request = Request.create('/');

        this.expectException(RuntimeException);
        await resolver.getArguments(request, getCallableFromArray([ new Fixtures.Controller(), 'controllerWithFoo' ]));
    }

    async testShouldInjectSession() {
        const resolver = new ArgumentResolver();
        const request = Request.create('/');
        request.session = new Session(new MockArraySessionStorage());

        const controller = getCallableFromArray([ new Fixtures.Controller(), 'controllerWithSession' ]);
        __self.assertEquals([ request.session ], await resolver.getArguments(request, controller));
    }
}
