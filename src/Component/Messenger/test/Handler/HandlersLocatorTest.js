const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const Envelope = Jymfony.Component.Messenger.Envelope;
const HandlerDescriptor = Jymfony.Component.Messenger.Handler.HandlerDescriptor;
const HandlersLocator = Jymfony.Component.Messenger.Handler.HandlersLocator;
const ReceivedStamp = Jymfony.Component.Messenger.Stamp.ReceivedStamp;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class HandlersLocatorTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    testItYieldsHandlerDescriptors() {
        const handler = new HandlersLocatorTestCallable();
        const locator = new HandlersLocator({
            [ReflectionClass.getClassName(DummyMessage)]: [ handler ],
        });

        const descriptor = new HandlerDescriptor(handler);
        __self.assertEquals([ descriptor ], [ ...locator.getHandlers(new Envelope(new DummyMessage('a'))) ]);
    }

    testItReturnsOnlyHandlersMatchingTransport() {
        const firstHandler = new HandlersLocatorTestCallable();
        const secondHandler = new HandlersLocatorTestCallable();

        const first = new HandlerDescriptor(firstHandler, { alias: 'one' });
        const second = new HandlerDescriptor(secondHandler, { from_transport: 'transportName', alias: 'three' });
        const locator = new HandlersLocator({
            [ReflectionClass.getClassName(DummyMessage)]: [
                first,
                new HandlerDescriptor(new HandlersLocatorTestCallable(), { from_transport: 'ignored', alias: 'two' }),
                second,
            ],
        });

        __self.assertEquals([
            first,
            second,
        ], [ ...locator.getHandlers(
            new Envelope(new DummyMessage('Body'), [ new ReceivedStamp('transportName') ])
        ) ]);
    }
}

class HandlersLocatorTestCallable {
    __invoke() {
    }
}
