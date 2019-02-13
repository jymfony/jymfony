declare namespace Jymfony.Component.Security.Firewall {
    import GetResponseEvent = Jymfony.Component.HttpServer.Event.GetResponseEvent;

    /**
     * @memberOf Jymfony.Component.Security.Firewall
     */
    export class ListenerInterface implements MixinInterface {
        public static readonly definition: Newable<ListenerInterface>;

        /**
         * Handles a request.
         */
        handle(event: GetResponseEvent): Promise<void>;
    }
}
