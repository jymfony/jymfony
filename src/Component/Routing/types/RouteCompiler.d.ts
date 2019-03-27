declare namespace Jymfony.Component.Routing {
    export class RouteCompiler {
        /**
         * Compiles a route.
         */
        private static compile(route: Route): CompiledRoute;

        private static _compilePattern(route: Route, pattern: string, isHost: boolean): any;

        private static _determineStaticPrefix(route: string, tokens: string[]): string;

        private static _findNextSeparator(pattern: string): string;

        private static _computeRegexp(tokens: string[], index: number, firstOptional: number): string;

        /**
         * Transforms capturing groups in requirements to non-capturing groups.
         */
        private static _transformCapturingGroupsToNonCapturings(regexp: string): string;
    }
}
