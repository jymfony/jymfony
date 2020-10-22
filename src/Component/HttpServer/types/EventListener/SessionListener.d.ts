declare namespace Jymfony.Component.HttpServer.EventListener {
    import ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;
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
        __construct(container: ContainerInterface, storageId: string): void;
        constructor(container: ContainerInterface, storageId: string);

        /**
         * @inheritdoc
         */
        getSession(request: RequestInterface): SessionInterface;
    }
}
