declare namespace Jymfony.Component.HttpServer.EventListener {
    import EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
    import RequestEvent = Jymfony.Contracts.HttpServer.Event.RequestEvent;
    import ResponseEvent = Jymfony.Contracts.HttpServer.Event.ResponseEvent;
    import SessionInterface = Jymfony.Component.HttpFoundation.Session.SessionInterface;
    import EventSubscriptions = Jymfony.Contracts.EventDispatcher.EventSubscriptions;

    /**
     * Sets the session onto the request on the "kernel.request" event and saves
     * it on the "kernel.response" event.
     *
     * In addition, if the session has been started it overrides the Cache-Control
     * header in such a way that all caching is disabled in that case.
     */
    export abstract class AbstractSessionListener extends implementationOf(EventSubscriberInterface) {
        /**
         * Listen on http.request to inject session factory
         */
        onRequest(event: RequestEvent): void;

        /**
         * Listen on http.request to inject session factory
         */
        onResponse(event: ResponseEvent): void;

        /**
         * @inheritdoc
         */
        static getSubscribedEvents(): EventSubscriptions;

        /**
         * Gets the session object.
         *
         * @returns A SessionInterface instance or undefined if no session is available
         */
        abstract getSession(): SessionInterface;
    }
}
