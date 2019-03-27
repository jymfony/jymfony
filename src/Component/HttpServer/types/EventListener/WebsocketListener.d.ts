declare namespace Jymfony.Component.HttpServer.EventListener {
    import EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
    import EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
    import EventSubscriptions = Jymfony.Component.EventDispatcher.EventSubscriptions;
    import GetResponseEvent = Jymfony.Component.HttpServer.Event.GetResponseEvent;
    import GetResponseForControllerResultEvent = Jymfony.Component.HttpServer.Event.GetResponseForControllerResultEvent;
    import FilterResponseEvent = Jymfony.Component.HttpServer.Event.FilterResponseEvent;

    export class WebsocketListener extends implementationOf(EventSubscriberInterface) {
        /**
         * Validates the websocket version.
         *
         * @param {Jymfony.Component.HttpServer.Event.GetResponseEvent} event
         */
        onRequest(event: GetResponseEvent): void;

        /**
         * @param {Jymfony.Component.HttpServer.Event.FilterResponseEvent} event
         * @param {string} eventName
         * @param {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface} dispatcher
         */
        onResponse(event: FilterResponseEvent, eventName: string, dispatcher: EventDispatcherInterface): void;

        /**
         * @param {Jymfony.Component.HttpServer.Event.GetResponseForControllerResultEvent} event
         */
        onView(event: GetResponseForControllerResultEvent): void;

        /**
         * @inheritdoc
         */
        static getSubscribedEvents(): EventSubscriptions;
    }
}
