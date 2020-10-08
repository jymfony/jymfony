declare namespace Jymfony.Component.Routing.Dumper {
    import RouteCollection = Jymfony.Component.Routing.RouteCollection;
    import Route = Jymfony.Component.Routing.Route;

    interface DumperOptions {
        class?: string;
        base_class?: string;
    }

    /**
     * JsMatcherDumper creates a JS class able to match URLs for a given set of routes.
     */
    export class JsMatcherDumper {
        private _routes: RouteCollection;
        private _regexList: string;
        private _variableCount: number;

        /**
         * Constructor.
         */
        __construct(routes: RouteCollection): void;
        constructor(routes: RouteCollection);

        /**
         * Dumps a set of routes to a JS class.
         *
         * Available options:
         *
         *  * class:      The class name
         *  * base_class: The base class name
         *
         * @param options An array of options
         *
         * @returns A JS class representing the matcher class
         */
        dump(options?: DumperOptions): string;

        /**
         * Generates the code for the match method implementing UrlMatcherInterface.
         */
        private _generateMatchMethod(): string;

        /**
         * Generates Js code to match a RouteCollection with all its routes.
         */
        private _compileRoutes(routes: RouteCollection, matchHost: boolean): string;

        /**
         * Splits static routes from dynamic routes, so that they can be matched first, using a simple switch.
         */
        private _groupStaticRoutes(collection: RouteCollection): [Record<string, Record<string, Route>>, RouteCollection];

        /**
         * Compiles static routes in a switch statement.
         *
         * Condition-less paths are put in a static array in the switch's default, with generic matching logic.
         * Paths that can match two or more routes, or have user-specified conditions are put in separate switch's cases.
         *
         * @throws {LogicException}
         */
        private _compileStaticRoutes(staticRoutes: Record<string, Record<string, Route>>, matchHost: boolean): string;

        /**
         * Compiles a regular expression followed by a switch statement to match dynamic routes.
         *
         * The regular expression matches both the host and the pathinfo at the same time. For stellar performance,
         * it is built as a tree of patterns, with re-ordering logic to group same-prefix routes together when possible.
         *
         * Patterns are named so that we know which one matched (https://pcre.org/current/doc/html/pcre2syntax.html#SEC23).
         * This name is used to "switch" to the additional logic required to match the final route.
         *
         * Condition-less paths are put in a static array in the switch's default, with generic matching logic.
         * Paths that can match two or more routes, or have user-specified conditions are put in separate switch's cases.
         *
         * Last but not least:
         *  - Because it is not possibe to mix unicode/non-unicode patterns in a single regexp, several of them can be generated.
         *  - The same regexp can be used several times when the logic in the switch rejects the match. When this happens, the
         *    matching-but-failing subpattern is blacklisted by replacing its name by "(*F)", which forces a failure-to-match.
         *    To ease this backlisting operation, the name of subpatterns is also the string offset where the replacement should occur.
         */
        private _compileDynamicRoutes(collection: RouteCollection, matchHost: boolean): string;

        /**
         * Compiles a regexp tree of subpatterns that matches nested same-prefix routes.
         *
         * @param tree
         * @param state A simple state object that keeps track of the progress of the compilation,
         *                       and gathers the generated switch's "case" and "default" statements
         * @param [prefixLen = 0]
         */
        private _compileStaticPrefixCollection(tree: StaticPrefixCollection, state: any, prefixLen?: number): string;

        /**
         * A simple helper to compiles the switch's "default" for both static and dynamic routes.
         */
        private _compileSwitchDefault(hasVars: boolean, matchHost: boolean): string;

        /**
         * Compiles a single Route to JS code used to match it against the path info.
         *
         * @throws {LogicException}
         */
        private _compileRoute(route: Route, name: string, checkHost: boolean): string;

        private _indent(code: string, level?: number): string;

        /**
         * @internal
         */
        private static export(value: any): string;

        private _getNextVariableName(): string;
    }
}
