declare namespace Jymfony.Component.Security.Http {
    import UrlGeneratorInterface = Jymfony.Component.Routing.Generator.UrlGeneratorInterface;
    import MatcherInterface = Jymfony.Component.Routing.Matcher.MatcherInterface;
    import Request = Jymfony.Component.HttpFoundation.Request;

    export class HttpUtils {
        private _urlGenerator: UrlGeneratorInterface;
        private _matcher: MatcherInterface;

        /**
         * Constructor.
         */
        __construct(urlGenerator: UrlGeneratorInterface, matcher: MatcherInterface): void;
        constructor(urlGenerator: UrlGeneratorInterface, matcher: MatcherInterface);

        /**
         * Checks that a given path matches the Request.
         *
         * @param request A Request instance
         * @param path A path (an absolute path (/foo), an absolute URL (http://...), or a route name (foo))
         *
         * @returns true if the path is the same as the one from the Request, false otherwise
         */
        checkRequestPath(request: Request, path: string): boolean;

        /**
         * Generates a URI, based on the given path or absolute URL.
         *
         * @param request A Request instance
         * @param path A path (an absolute path (/foo), an absolute URL (http://...), or a route name (foo))
         *
         * @returns An absolute URL
         *
         * @throws {LogicException}
         */
        generateUri(request: Request, path: string): string;
    }
}
