const EventSubscriberInterface = Jymfony.Component.EventDispatcher.EventSubscriberInterface;
const HttpException = Jymfony.Component.HttpFoundation.Exception.HttpException;
const Request = Jymfony.Component.HttpFoundation.Request;
const Response = Jymfony.Component.HttpFoundation.Response;
const Websocket = Jymfony.Component.HttpFoundation.Websocket.Websocket;
const WebsocketResponse = Jymfony.Component.HttpFoundation.Websocket.WebsocketResponse;
const Events = Jymfony.Component.HttpServer.Event.HttpServerEvents;

/**
 * @memberOf Jymfony.Component.HttpServer.EventListener
 */
class WebsocketListener extends implementationOf(EventSubscriberInterface) {
    /**
     * Validates the websocket version.
     *
     * @param {Jymfony.Component.HttpServer.Event.GetResponseEvent} event
     */
    onRequest(event) {
        const request = event.request;
        if (request.attributes.has(Request.ATTRIBUTE_PARENT_REQUEST)) {
            return; // Avoid loops
        }

        if (! request.headers.has('Sec-WebSocket-Key')) {
            return;
        }

        if (! request.headers.has('Sec-WebSocket-Version')) {
            throw new HttpException(Response.HTTP_BAD_REQUEST, 'Client must provide a value for Sec-WebSocket-Version.');
        }

        const websocketVersion = ~~request.headers.get('Sec-WebSocket-Version');
        switch (websocketVersion) {
            case 8:
                request.headers.set('Origin', request.headers.get('Sec-WebSocket-Origin'));
                break;

            case 13:
                break;

            default:
                throw new HttpException(Response.HTTP_UPGRADE_REQUIRED, __jymfony.sprintf(
                    'Unsupported websocket client version: %s. Only versions 8 and 13 are supported.',
                    websocketVersion
                ));
        }

        request.attributes.set('_websocket_version', ~~websocketVersion);
    }

    /**
     * @param {Jymfony.Component.HttpServer.Event.FilterResponseEvent} event
     * @param {string} eventName
     * @param {Jymfony.Component.EventDispatcher.EventDispatcherInterface} dispatcher
     */
    onResponse(event, eventName, dispatcher) {
        const request = event.request;
        const response = event.response;

        if (event.response instanceof WebsocketResponse) {
            event.response.eventDispatcher = dispatcher;
        }

        if (8 === request.attributes.get('_websocket_version')) {
            response.headers.set('Sec-WebSocket-Origin', response.headers.get('Origin'));
        }
    }

    /**
     * @param {Jymfony.Component.HttpServer.Event.GetResponseForControllerResultEvent} event
     */
    onView(event) {
        const result = event.controllerResult;

        if (result instanceof Websocket) {
            event.response = new WebsocketResponse(result);
        }
    }

    /**
     * @inheritdoc
     */
    static getSubscribedEvents() {
        return {
            [Events.REQUEST]: [ 'onRequest', 128 ],
            [Events.VIEW]: [ 'onView', 15 ],
            [Events.RESPONSE]: [ 'onResponse', -128 ],
        };
    }
}

module.exports = WebsocketListener;
