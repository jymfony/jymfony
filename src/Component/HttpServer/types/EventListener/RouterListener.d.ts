declare namespace Jymfony.Component.HttpServer.EventListener {
    import EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
    import EventSubscriptions = Jymfony.Contracts.EventDispatcher.EventSubscriptions;
    import LoggerInterface = Jymfony.Component.Logger.LoggerInterface;
    import Response = Jymfony.Component.HttpFoundation.Response;
    import GetResponseEvent = Jymfony.Component.HttpServer.Event.GetResponseEvent;
    import GetResponseForExceptionEvent = Jymfony.Component.HttpServer.Event.GetResponseForExceptionEvent;
    import MatcherInterface = Jymfony.Component.Routing.Matcher.MatcherInterface;

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

        private _projectDir: string;
        private _debug: boolean;

        /**
         * Constructor.
         */
        __construct(matcher: MatcherInterface, logger?: LoggerInterface, projectDir?: string, debug?: boolean): void;
        constructor(matcher: MatcherInterface, logger?: LoggerInterface, projectDir?: string, debug?: boolean);

        /**
         * Call the router matcher and set attributes into the request object.
         */
        onRequest(event: GetResponseEvent): void;

        /**
         * Handles NoConfigurationException displaying a welcome page
         * if debug is enabled.
         */
        onException(event: GetResponseForExceptionEvent): void;

        /**
         * @inheritdoc
         */
        static getSubscribedEvents(): EventSubscriptions;

        /**
         * Renders a welcome page.
         */
        private _createWelcomePage(): Response;
    }
}
