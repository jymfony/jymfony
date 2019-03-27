declare namespace Jymfony.Component.Routing.Generator {
    import Request = Jymfony.Component.HttpFoundation.Request;
    import RouteCollection = Jymfony.Component.Routing.RouteCollection;
    import RequestContext = Jymfony.Component.Routing.RequestContext;

    /**
     * UrlGenerator can generate a URL or a path for any route in the RouteCollection
     * based on the passed parameters.
     */
    export class UrlGenerator extends implementationOf(UrlGeneratorInterface) {
        private _routeCollection: RouteCollection;
        private _context: RequestContext;
        private _defaultLocale: string;

        /**
         * Constructor.
         */
        __construct(routeCollection: RouteCollection, context?: RequestContext, defaultLocale?: string): void;
        constructor(routeCollection: RouteCollection, context?: RequestContext, defaultLocale?: string);

        /**
         * @inheritdoc
         */
        withContext(request: Request): UrlGeneratorInterface;

        /**
         * @inheritdoc
         */

        generate(name: string, parameters?: Record<string, any>, referenceType?: number): string;

        /**
         * Do generate an address from route components.
         */
        private _doGenerate(
            variables: string[],
            defaults: Record<string, string>,
            tokens: string[][],
            parameters: Record<string, any>,
            name: string,
            referenceType: number,
            hostTokens: string[][],
            requiredSchemes?: string[]
        ): string;

        /**
         * Returns the target path as relative reference from the base path.
         *
         * Only the URIs path component (no schema, host etc.) is relevant and must be given, starting with a slash.
         * Both paths must be absolute and not contain relative parts.
         * Relative URLs from one resource to another are useful when generating self-contained downloadable document archives.
         * Furthermore, they can be used to reduce the link size in documents.
         *
         * Example target paths, given a base path of "/a/b/c/d":
         * - "/a/b/c/d"     -> ""
         * - "/a/b/c/"      -> "./"
         * - "/a/b/"        -> "../"
         * - "/a/b/c/other" -> "other"
         * - "/a/x/y"       -> "../../x/y"
         */
        static getRelativePath(basePath: string, targetPath: string): string;
    }
}
