declare namespace Jymfony.Component.Messenger.Middleware {
    import Envelope = Jymfony.Component.Messenger.Envelope;

    export class MiddlewareInterface {
        handle(envelope: Envelope, stack: StackInterface): Promise<Envelope> | Envelope;
    }
}
