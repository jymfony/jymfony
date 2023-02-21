declare namespace Jymfony.Component.Messenger.Event {
    /**
     * Dispatched after a message was received from a transport and successfully handled.
     *
     * The event name is the class name.
     *
     * @final
     */
    export class WorkerMessageHandledEvent extends AbstractWorkerMessageEvent {
    }
}
