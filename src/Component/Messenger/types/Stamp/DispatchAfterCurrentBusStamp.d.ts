declare namespace Jymfony.Component.Messenger.Stamp {
    /**
     * Marker item to tell this message should be handled in after the current bus has finished.
     *
     * @see Jymfony.Component.Messenger.Middleware.DispatchAfterCurrentBusMiddleware
     *
     * @final
     */
    export class DispatchAfterCurrentBusStamp extends implementationOf(NonSendableStampInterface) {
    }
}
