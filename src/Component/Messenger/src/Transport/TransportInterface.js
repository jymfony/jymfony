const ReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver;
const SenderInterface = Jymfony.Component.Messenger.Transport.Sender;

/**
 * @memberOf Jymfony.Component.Messenger.Transport
 */
class TransportInterface extends ReceiverInterface.definition, SenderInterface.definition {
}

export default getInterface(TransportInterface);
