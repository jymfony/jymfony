const StampInterface = Jymfony.Component.Messenger.Stamp.StampInterface;

/**
 * A stamp that should not be included with the Envelope if sent to a transport.
 *
 * @memberOf Jymfony.Component.Messenger.Stamp
 */
class NonSendableStampInterface extends StampInterface.definition
{
}

export default getInterface(NonSendableStampInterface);
