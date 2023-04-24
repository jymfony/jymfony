const AbstractWorkerMessageEvent = Jymfony.Component.Messenger.Event.AbstractWorkerMessageEvent;

/**
 * Dispatched after a message has been sent for retry.
 *
 * @memberOf Jymfony.Component.Messenger.Event
 * @final
 */
export default class WorkerMessageRetriedEvent extends AbstractWorkerMessageEvent {
}
