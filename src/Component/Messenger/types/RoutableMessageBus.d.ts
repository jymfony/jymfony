declare namespace Jymfony.Component.Messenger {
    import ContainerInterface = Jymfony.Contracts.DependencyInjection.ContainerInterface;
    import StampInterface = Jymfony.Component.Messenger.Stamp.StampInterface;


    /**
     * Bus of buses that is routable using a BusNameStamp.
     *
     * This is useful when passed to Worker: messages received
     * from the transport can be sent to the correct bus.
     */
    export class RoutableMessageBus extends implementationOf(MessageBusInterface) {
        private _busLocator: ContainerInterface;
        private _fallbackBus: null | MessageBusInterface;

        /**
         * Constructor.
         */
        __construct(busLocator: ContainerInterface, fallbackBus?: MessageBusInterface): void;
        constructor(busLocator: ContainerInterface, fallbackBus?: MessageBusInterface);

        /**
         * @param message The message or the message pre-wrapped in an envelope
         * @param [stamps]
         */
        dispatch<T extends object>(message: T | Envelope<T>, stamps?: StampInterface[]): Promise<Envelope<T>>;

        /**
         * @internal
         */
        getMessageBus(busName: string): MessageBusInterface;
    }
}
