const NonSendableStampInterface = Jymfony.Component.Messenger.Stamp.NonSendableStampInterface;

/**
 * Marker item to tell this message should be handled in after the current bus has finished.
 *
 * @see Jymfony.Component.Messenger.Middleware.DispatchAfterCurrentBusMiddleware
 *
 * @memberOf Jymfony.Component.Messenger.Stamp
 * @final
 */
export default class DispatchAfterCurrentBusStamp extends implementationOf(NonSendableStampInterface) {
}
