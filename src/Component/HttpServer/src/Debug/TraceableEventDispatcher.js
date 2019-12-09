const BaseTraceableEventDispatcher = Jymfony.Component.EventDispatcher.Debug.TraceableEventDispatcher;
const HttpServerEvents = Jymfony.Component.HttpServer.Event.HttpServerEvents;

/**
 * @memberOf Jymfony.Component.HttpServer.Debug
 */
export default class TraceableEventDispatcher extends BaseTraceableEventDispatcher {
    /**
     * @inheritdoc
     */
    _preDispatch(eventName, event) { // eslint-disable-line no-unused-vars
        switch (eventName) {
            case HttpServerEvents.REQUEST:
                this._stopwatch.openSection();
                break;

            case HttpServerEvents.VIEW:
            case HttpServerEvents.RESPONSE:
                // Stop only if a controller has been executed
                if (this._stopwatch.isStarted('controller')) {
                    this._stopwatch.stop('controller');
                }
                break;
        }
    }

    /**
     * @inheritdoc
     */
    _postDispatch(eventName, event) { // eslint-disable-line no-unused-vars
        if (HttpServerEvents.CONTROLLER_ARGUMENTS === eventName) {
            this._stopwatch.start('controller', 'section');
        }
    }
}
