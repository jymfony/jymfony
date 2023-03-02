const RuntimeException = Jymfony.Component.Messenger.Exception.RuntimeException;
const StopWorkerExceptionInterface = Jymfony.Component.Messenger.Exception.StopWorkerExceptionInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Exception
 */
export default class StopWorkerException extends mix(RuntimeException, StopWorkerExceptionInterface) {
    /**
     * Constructor.
     *
     * @param {string} [message = 'Worker should stop.']
     * @param {Error | null} [previous = null]
     */
    __construct(message = 'Worker should stop.', previous = null) {
        super.__construct(message, 0, previous);
    }
}
