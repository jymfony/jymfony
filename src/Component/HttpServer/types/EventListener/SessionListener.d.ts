declare namespace Jymfony.Component.HttpServer.EventListener {
    import ContainerInterface = Jymfony.Contracts.DependencyInjection.ContainerInterface;
    import RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;
    import SessionInterface = Jymfony.Component.HttpFoundation.Session.SessionInterface;

    /**
     * @final
     */
    export class SessionListener extends AbstractSessionListener {
        private _container: ContainerInterface;
        private _storageId: string;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(container: ContainerInterface, storageId: string, cookieLifetime?: number, cookiePath?: string, cookieDomain?: undefined | string, cookieSecure?: boolean, cookieHttpOnly?: boolean): void;
        constructor(container: ContainerInterface, storageId: string, cookieLifetime?: number, cookiePath?: string, cookieDomain?: undefined | string, cookieSecure?: boolean, cookieHttpOnly?: boolean);

        /**
         * @inheritdoc
         */
        getSession(request: RequestInterface): SessionInterface;
    }
}
