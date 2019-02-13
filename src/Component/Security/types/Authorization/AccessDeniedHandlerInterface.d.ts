declare namespace Jymfony.Component.Security.Authorization {
    import Request = Jymfony.Component.HttpFoundation.Request;
    import AccessDeniedException = Jymfony.Component.Security.Exception.AccessDeniedException;
    import Response = Jymfony.Component.HttpFoundation.Response;

    /**
     * Handles an access denied exception and return a response.
     */
    export class AccessDeniedHandlerInterface implements MixinInterface {
        public static readonly definition: Newable<AccessDeniedHandlerInterface>;

        /**
         * Handles an AccessDeniedException, eventually returning a Response.
         */
        handle(request: Request, exception: AccessDeniedException): Promise<Response | undefined | null>;
    }
}
