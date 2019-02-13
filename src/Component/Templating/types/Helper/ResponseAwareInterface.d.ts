declare namespace Jymfony.Component.Templating.Helper {
    import Response = Jymfony.Component.HttpFoundation.Response;

    /**
     * Represents an helper accepting a request context.
     */
    export class ResponseAwareInterface implements MixinInterface {
        public static readonly definition: Newable<ResponseAwareInterface>;

        /**
         * Sets the request.
         */
        withResponse(response: Response): this;
    }
}
