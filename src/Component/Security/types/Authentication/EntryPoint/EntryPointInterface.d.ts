declare namespace Jymfony.Component.Security.Authentication.EntryPoint {
    import Request = Jymfony.Component.HttpFoundation.Request;
    import Response = Jymfony.Component.HttpFoundation.Response;
    import AuthenticationException = Jymfony.Component.Security.Exception.AuthenticationException;

    /**
     * Implement this interface for any classes that will be called to "start"
     * the authentication process (see method for more details).
     */
    export class EntryPointInterface {
        /**
         * Returns a response that directs the user to authenticate.
         *
         * This is called when an anonymous request accesses a resource that
         * requires authentication. The job of this method is to return some
         * response that "helps" the user start into the authentication process.
         *
         * Examples:
         *
         * - For a form login, you might redirect to the login page
         *
         *     return new RedirectResponse('/login');
         *
         * - For an API token authentication system, you return a 401 response
         *
         *     return new Response('Auth header required', 401);
         *
         * @param request The request that resulted in an AuthenticationException
         * @param [authException] The exception that started the authentication process
         */
        start(request: Request, authException?: AuthenticationException | undefined): Response;
    }
}
