declare namespace Jymfony.Component.Messenger.Event {
    /**
     * Dispatched when a message was received from a transport but before sent to the bus.
     *
     * The event name is the class name.
     *
     * @final
     */
    export class WorkerMessageReceivedEvent extends AbstractWorkerMessageEvent {
        private _shouldHandle: boolean;

        __construct(envelope: Envelope, receiverName: string): void;
        constructor(envelope: Envelope, receiverName: string);

        shouldHandle(shouldHandle?: boolean | null): boolean;
    }
}
