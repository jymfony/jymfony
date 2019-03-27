declare namespace Jymfony.Component.Routing.Generator {
    import Request = Jymfony.Component.HttpFoundation.Request;

    /**
     * Represents an url generator, which is capable to generate an url
     * (or part of it) for a given route/resource.
     */
    export class UrlGeneratorInterface {
        public static readonly definition: Newable<UrlGeneratorInterface>;

        /**
         * Generates an absolute URL, e.g. "http://example.com/dir/file".
         */
        public static readonly ABSOLUTE_URL = 0;

        /**
         * Generates an absolute path, e.g. "/dir/file".
         */
        public static readonly ABSOLUTE_PATH = 1;

        /**
         * Generates a relative path based on the current request path, e.g. "../parent-file".
         *
         * @see UrlGenerator.getRelativePath()
         */
        public static readonly RELATIVE_PATH = 2;

        /**
         * Generates a network path, e.g. "//example.com/dir/file".
         * Such reference reuses the current scheme but specifies the host.
         */
        public static readonly NETWORK_PATH = 3;

        /**
         * Returns a new url generator with context set for the given request.
         */
        withContext(request: Request): UrlGeneratorInterface;

        /**
         * Generates a URL or path for a specific route based on the given parameters.
         *
         * Parameters that reference placeholders in the route pattern will substitute them in the
         * path or host. Extra params are added as query string to the URL.
         *
         * When the passed reference type cannot be generated for the route because it requires a different
         * host or scheme than the current one, the method will return a more comprehensive reference
         * that includes the required params. For example, when you call this method with referenceType = ABSOLUTE_PATH
         * but the route requires the https scheme whereas the current scheme is http, it will instead return an
         * ABSOLUTE_URL with the https scheme and the current host. This makes sure the generated URL matches
         * the route in any case.
         *
         * The special parameter _fragment will be used as the document fragment suffixed to the final URL.
         *
         * @throws {Jymfony.Component.Routing.Exception.RouteNotFoundException} If the named route doesn't exist
         * @throws {Jymfony.Component.Routing.Exception.MissingMandatoryParametersException} When some parameters are
         *      missing that are mandatory for the route
         * @throws {Jymfony.Component.Routing.Exception.InvalidParameterException} When a parameter value for a placeholder
         *      is not correct because it does not match the requirement
         */
        generate(name: string, parameters?: Record<string, any>, referenceType?: number): string;
    }
}
