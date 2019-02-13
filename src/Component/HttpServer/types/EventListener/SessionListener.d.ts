declare namespace Jymfony.Component.HttpServer.EventListener {
    import SessionInterface = Jymfony.Component.HttpFoundation.Session.SessionInterface;
    import ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;

    /**
     * @final
     */
    export class SessionListener extends AbstractSessionListener {
        private _container: ContainerInterface;
        private _storageId: string;

        /**
         * Constructor.
         *
         * @param {Jymfony.Component.DependencyInjection.ContainerInterface} container
         * @param {string} storageId
         */
        __construct(container: ContainerInterface, storageId: string): void;

        constructor(container: ContainerInterface, storageId: string);

        /**
         * @inheritdoc
         */
        getSession(): SessionInterface;
    }
}
