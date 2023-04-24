const NonSendableStampInterface = Jymfony.Component.Messenger.Stamp.NonSendableStampInterface;

/**
 * A marker that this message was consumed by a worker process.
 *
 * @memberOf Jymfony.Component.Messenger.Stamp
 */
export default class ConsumedByWorkerStamp extends implementationOf(NonSendableStampInterface) {
}
