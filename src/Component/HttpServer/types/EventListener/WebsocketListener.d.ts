declare namespace Jymfony.Component.HttpServer.EventListener {
    import EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
    import EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
    import EventSubscriptions = Jymfony.Contracts.EventDispatcher.EventSubscriptions;
    import RequestEvent = Jymfony.Contracts.HttpServer.Event.RequestEvent;
    import ViewEvent = Jymfony.Contracts.HttpServer.Event.ViewEvent;
    import ResponseEvent = Jymfony.Contracts.HttpServer.Event.ResponseEvent;

    export class WebsocketListener extends implementationOf(EventSubscriberInterface) {
        /**
         * Validates the websocket version.
         */
        onRequest(event: RequestEvent): void;

        onResponse(event: ResponseEvent, eventName: string, dispatcher: EventDispatcherInterface): void;
        onView(event: ViewEvent): void;

        /**
         * @inheritdoc
         */
        static getSubscribedEvents(): EventSubscriptions;
    }
}
