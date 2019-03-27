declare namespace Jymfony.Component.Security.Logout {
    import HttpUtils = Jymfony.Component.Security.Http.HttpUtils;
    import GetResponseEvent = Jymfony.Component.HttpServer.Event.GetResponseEvent;
    import ListenerInterface = Jymfony.Component.Security.Firewall.ListenerInterface;

    class LogoutListener extends implementationOf(ListenerInterface) {
        private _httpUtils: HttpUtils;
        private _path: string;
        private _targetPath: string;
        private _handlers: LogoutHandlerInterface[];

        /**
         * Constuctor.
         */
        __construct(httpUtils: HttpUtils, logoutPath: string, targetPath?: string): void;
        constructor(httpUtils: HttpUtils, logoutPath: string, targetPath?: string);

        /**
         * Adds a logout handler to this listener.
         */
        addHandler(handler: LogoutHandlerInterface): void;

        /**
         * @inheritdoc
         */
        handle(event: GetResponseEvent): Promise<void>;
    }
}
