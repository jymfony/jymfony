const AddBusNameStampMiddleware = Jymfony.Component.Messenger.Middleware.AddBusNameStampMiddleware;
const BusNameStamp = Jymfony.Component.Messenger.Stamp.BusNameStamp;
const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const Envelope = Jymfony.Component.Messenger.Envelope;
const MiddlewareTestCase = Jymfony.Component.Messenger.Test.MiddlewareTestCase;

export default class AddBusNameStampMiddlewareTest extends MiddlewareTestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    testItSendsTheMessageToAssignedSender() {
        const middleware = new AddBusNameStampMiddleware('the_bus_name');
        const envelope = new Envelope(new DummyMessage('the message'));

        const finalEnvelope = middleware.handle(envelope, this._getStackMock());

        const busNameStamp = finalEnvelope.last(BusNameStamp);
        __self.assertNotNull(busNameStamp);
        __self.assertSame('the_bus_name', busNameStamp.busName);

        // The stamp should not be added over and over again
        const otherEnvelope = middleware.handle(finalEnvelope, this._getStackMock());
        __self.assertCount(1, otherEnvelope.all(BusNameStamp));
    }
}
