declare namespace Jymfony.Component.HttpServer.Debug {
    import BaseTraceableEventDispatcher = Jymfony.Component.EventDispatcher.Debug.TraceableEventDispatcher;
    import Event = Jymfony.Contracts.EventDispatcher.Event;

    export class TraceableEventDispatcher extends BaseTraceableEventDispatcher {
        /**
         * @inheritdoc
         */
        protected _preDispatch(eventName: string, event: Event): void;

        /**
         * @inheritdoc
         */
        protected _postDispatch(eventName: string, event: Event): void;
    }
}
