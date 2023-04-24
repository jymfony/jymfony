declare namespace Jymfony.Component.Messenger.Middleware {
    import Envelope = Jymfony.Component.Messenger.Envelope;

    export class FailedMessageProcessingMiddleware extends implementationOf(MiddlewareInterface) {
        handle(envelope: Envelope, stack: StackInterface): Promise<Envelope> | Envelope;
    }
}
