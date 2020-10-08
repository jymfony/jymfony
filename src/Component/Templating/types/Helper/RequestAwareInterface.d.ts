declare namespace Jymfony.Component.Templating.Helper {
    import Request = Jymfony.Component.HttpFoundation.Request;

    /**
     * Represents an helper accepting a request context.
     */
    export class RequestAwareInterface {
        public static readonly definition: Newable<RequestAwareInterface>;

        /**
         * Sets the request.
         */
        withRequest(request: Request): this;
    }
}
