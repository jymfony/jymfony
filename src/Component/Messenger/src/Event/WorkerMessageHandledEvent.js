const AbstractWorkerMessageEvent = Jymfony.Component.Messenger.Event.AbstractWorkerMessageEvent;

/**
 * Dispatched after a message was received from a transport and successfully handled.
 *
 * The event name is the class name.
 *
 * @memberOf Jymfony.Component.Messenger.Event
 * @final
 */
export default class WorkerMessageHandledEvent extends AbstractWorkerMessageEvent {
}
