declare namespace Jymfony.Component.Routing.Matcher {
    import Request = Jymfony.Component.HttpFoundation.Request;

    /**
     * Matcher for request objects.
     */
    export class MatcherInterface {
        public static readonly definition: Newable<MatcherInterface>;

        /**
         * Tries to match a request with a set of routes.
         *
         * If the matcher can not find information, it must throw one of the exceptions documented
         * below.
         *
         * @throws {Jymfony.Component.Routing.Exception.NoConfigurationException} If no routing configuration could be found
         * @throws {Jymfony.Component.Routing.Exception.ResourceNotFoundException} If no matching resource could be found
         * @throws {Jymfony.Component.Routing.Exception.MethodNotAllowedException} If a matching resource was found but the request method is not allowed
         */
        matchRequest(request: Request): Record<string, any>;
    }
}
