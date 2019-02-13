declare namespace Jymfony.Component.HttpServer.EventListener {
    import EventSubscriberInterface = Jymfony.Component.EventDispatcher.EventSubscriberInterface;
    import LoggerInterface = Jymfony.Component.Logger.LoggerInterface;
    import MatcherInterface = Jymfony.Component.Routing.Matcher.MatcherInterface;
    import GetResponseEvent = Jymfony.Component.HttpServer.Event.GetResponseEvent;
    import EventSubscriptions = Jymfony.Component.EventDispatcher.EventSubscriptions;

    export class RouterListener extends implementationOf(EventSubscriberInterface) {
        /**
         * @type {Jymfony.Component.Routing.Matcher.MatcherInterface}
         *
         * @private
         */
        private _matcher: MatcherInterface;

        /**
         * @type {Jymfony.Component.Logger.LoggerInterface}
         *
         * @private
         */
        private _logger: LoggerInterface;

        private _debug: boolean;

        /**
         * Constructor.
         */
        __construct(matcher: MatcherInterface, logger?: LoggerInterface, debug?: boolean): void;
        constructor(matcher: MatcherInterface, logger?: LoggerInterface, debug?: boolean);

        /**
         * Call the router matcher and set attributes into the request object.
         */
        onRequest(event: GetResponseEvent): void;

        /**
         * @inheritdoc
         */
        static getSubscribedEvents(): EventSubscriptions;
    }
}
