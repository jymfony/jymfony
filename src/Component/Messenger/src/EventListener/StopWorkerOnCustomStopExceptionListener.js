const EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
const HandlerFailedException = Jymfony.Component.Messenger.Exception.HandlerFailedException;
const StopWorkerExceptionInterface = Jymfony.Component.Messenger.Exception.StopWorkerExceptionInterface;
const WorkerMessageFailedEvent = Jymfony.Component.Messenger.Event.WorkerMessageFailedEvent;
const WorkerRunningEvent = Jymfony.Component.Messenger.Event.WorkerRunningEvent;

/**
 * @memberOf Jymfony.Component.Messenger.EventListener
 */
export default class StopWorkerOnCustomStopExceptionListener extends implementationOf(EventSubscriberInterface) {
    /**
     * Constructor.
     */
    __construct() {
        this._stop = false;
    }

    /**
     * @param {Jymfony.Component.Messenger.Event.WorkerMessageFailedEvent} event
     */
    onMessageFailed(event) {
        const th = event.throwable;
        if (th instanceof StopWorkerExceptionInterface) {
            this._stop = true;
        }

        if (th instanceof HandlerFailedException) {
            for (const e of th.nestedExceptions) {
                if (e instanceof StopWorkerExceptionInterface) {
                    this._stop = true;
                    break;
                }
            }
        }
    }

    /**
     * @param {Jymfony.Component.Messenger.Event.WorkerRunningEvent} event
     */
    onWorkerRunning(event) {
        if (this._stop) {
            event.worker.stop();
        }
    }

    static getSubscribedEvents() {
        return {
            [ReflectionClass.getClassName(WorkerMessageFailedEvent)]: 'onMessageFailed',
            [ReflectionClass.getClassName(WorkerRunningEvent)]: 'onWorkerRunning',
        };
    }
}
