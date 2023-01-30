declare namespace Jymfony.Component.Messenger.Transport {
    import ReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface;
    import SenderInterface = Jymfony.Component.Messenger.Transport.Sender.SenderInterface;

    interface TransportInterface extends ReceiverInterface, SenderInterface {}
    export class TransportInterface {
    }
}
