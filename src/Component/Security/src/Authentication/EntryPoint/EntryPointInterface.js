/**
 * Implement this interface for any classes that will be called to "start"
 * the authentication process (see method for more details).
 *
 * @memberOf Jymfony.Component.Security.Authentication.EntryPoint
 */
class EntryPointInterface {
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
     * @param {Jymfony.Component.HttpFoundation.Request} request The request that resulted in an AuthenticationException
     * @param {Jymfony.Component.Security.Exception.AuthenticationException} [authException] The exception that started the authentication process
     *
     * @return Response
     */
    start(request, authException = undefined) { }
}

module.exports = getInterface(EntryPointInterface);
