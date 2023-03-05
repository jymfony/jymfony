const DummyCommandHandler = Jymfony.Component.Messenger.Fixtures.DummyCommandHandler;
const HandlerDescriptor = Jymfony.Component.Messenger.Handler.HandlerDescriptor;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class HandleDescriptorTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    @dataProvider('provideHandlers')
    testDescriptorNames(handler, expectedHandler) {
        const descriptor = new HandlerDescriptor(handler);

        if (isRegExp(expectedHandler)) {
            __self.assertMatchesRegularExpression(expectedHandler, descriptor.name);
        } else {
            __self.assertEquals(expectedHandler, descriptor.name);
        }
    }

    * provideHandlers() {
        yield [ function () {}, 'Closure' ];
        yield [ () => {}, 'Closure' ];
        yield [ global.dump, 'dump' ];
        yield [ new DummyCommandHandler(), ReflectionClass.getClassName(DummyCommandHandler) + '#__invoke' ];
        yield [
            getCallableFromArray([ new DummyCommandHandlerWithSpecificMethod(), 'handle' ]),
            ReflectionClass.getClassName(DummyCommandHandlerWithSpecificMethod) + '#handle',
        ];
        yield [ (() => {}).bind({}), 'Closure' ];
        yield [ (function () {}).bind({}), 'Closure' ];
        yield [ new class {
            __invoke() {
            }
        }(), /Jymfony\.Component\.Messenger\.Tests\.Handler\._anonymous_xΞ.{1,5}#__invoke/ ];
    }
}

class DummyCommandHandlerWithSpecificMethod {
    handle() {
    }
}
