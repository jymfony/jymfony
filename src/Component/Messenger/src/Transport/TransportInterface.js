const ReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface;
const SenderInterface = Jymfony.Component.Messenger.Transport.Sender.SenderInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Transport
 */
class TransportInterface  {
}

export default getInterface(TransportInterface, ReceiverInterface, SenderInterface);
