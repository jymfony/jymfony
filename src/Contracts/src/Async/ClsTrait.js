const asyncHook = require('async_hooks');
globalThis.__jymfony = globalThis.__jymfony || {};

const EventListener = (() => {
    if (ReflectionClass.exists('Jymfony.Component.EventDispatcher.Annotation.EventListener')) {
        return Jymfony.Component.EventDispatcher.Annotation.EventListener;
    }

    return function() {
        return () => {};
    };
})();

/**
 * @memberOf Jymfony.Contracts.Async
 */
class ClsTrait {
    __construct() {
        /**
         * @type {int}
         *
         * @private
         */
        this._currentUid = -1;

        /**
         * @type {object}
         *
         * @private
         */
        this._activeContext = Object.create(Object.prototype);

        /**
         * @type {object[]}
         *
         * @private
         */
        this._contextSet = [];

        /**
         * @type {undefined|object}
         * @private
         */
        this._consoleContext = undefined;

        /**
         * @type {WeakMap<Jymfony.Component.HttpFoundation.Request, object>}
         *
         * @private
         */
        this._requestContexts = new WeakMap();

        /**
         * @type {Map<int, object>}
         *
         * @private
         */
        this._contexts = new Map();
        this._initAsyncHooks();
    }

    /**
     * Called on console command init.
     *
     * @private
     */
    @EventListener({ event: 'console.command', priority: 1024 })
    _onConsoleCommand(event) {
        this._contextSet.push(this._activeContext);
        this._consoleContext = this._activeContext = Object.create(this._activeContext);

        this._activeContext[ClsTrait.COMMAND_SYMBOL] = event.command;
    }

    /**
     * Console command terminate (called on console exit).
     *
     * @private
     */
    @EventListener({ event: 'console.terminate', priority: -1024 })
    _onConsoleTerminate() {
        if (this._activeContext === this._consoleContext) {
            this._activeContext = this._contextSet.pop();
            return;
        }

        const index = this._contextSet.lastIndexOf(this._consoleContext);
        if (0 > index) {
            return;
        }

        this._contextSet.splice(index, 1);
    }

    /**
     * Called on http server request init.
     *
     * @param {Jymfony.Contracts.HttpServer.Event.RequestEvent} event
     *
     * @private
     */
    @EventListener({ event: 'http.request', priority: 1024 })
    _onHttpRequest(event) {
        const request = event.request;

        this._contextSet.push(this._activeContext);
        this._requestContexts.set(request, this._activeContext = Object.create(this._activeContext));
        this._activeContext[ClsTrait.REQUEST_SYMBOL] = request;
    }

    /**
     * Called on http server request finish.
     *
     * @param {Jymfony.Contracts.HttpServer.Event.FinishRequestEvent} event
     *
     * @private
     */
    @EventListener({ event: 'http.finish_request', priority: -1024 })
    _onHttpFinishRequest(event) {
        const request = event.request;
        const context = this._requestContexts.get(request);
        this._requestContexts.delete(request);

        if (this._activeContext === context) {
            this._activeContext = this._contextSet.pop();
            return;
        }

        const index = this._contextSet.lastIndexOf(context);
        if (0 > index) {
            return;
        }

        this._contextSet.splice(index, 1);
    }

    /**
     * Initialize async hooks to have request/command context.
     *
     * @private
     */
    _initAsyncHooks() {
        asyncHook.createHook({
            init: asyncId => {
                this._currentUid = asyncHook.executionAsyncId();
                this._contexts.set(asyncId, this._activeContext);
            },
            before: asyncId => {
                this._currentUid = asyncHook.executionAsyncId();
                const context = this._contexts.get(asyncId) || this._contexts.get(this._currentUid);

                this._contextSet.push(this._activeContext);
                this._activeContext = context;
            },
            after: asyncId => {
                this._currentUid = asyncHook.executionAsyncId();
                const context = this._contexts.get(asyncId) || this._contexts.get(this._currentUid);

                if (this._activeContext === context) {
                    this._activeContext = this._contextSet.pop();
                    return;
                }

                const index = this._contextSet.lastIndexOf(context);
                if (0 > index) {
                    return;
                }

                this._contextSet.splice(index, 1);
            },
            destroy: asyncId => {
                this._currentUid = asyncHook.executionAsyncId();
                this._contexts.delete(asyncId);
            },
        });
    }
}

ClsTrait.COMMAND_SYMBOL = Symbol.for('command');
ClsTrait.REQUEST_SYMBOL = Symbol.for('request');

export default getTrait(ClsTrait);
