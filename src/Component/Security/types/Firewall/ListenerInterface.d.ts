declare namespace Jymfony.Component.Security.Firewall {
    import RequestEvent = Jymfony.Contracts.HttpServer.Event.RequestEvent;

    /**
     * @memberOf Jymfony.Component.Security.Firewall
     */
    export class ListenerInterface implements MixinInterface {
        public static readonly definition: Newable<ListenerInterface>;

        /**
         * Handles a request.
         */
        handle(event: RequestEvent): Promise<void>;
    }
}
