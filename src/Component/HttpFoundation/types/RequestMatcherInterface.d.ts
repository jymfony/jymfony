declare namespace Jymfony.Component.HttpFoundation {
    /**
     * RequestMatcherInterface is an interface for strategies to match a Request.
     */
    export class RequestMatcherInterface {
        public static readonly definition: Newable<RequestMatcherInterface>;

        /**
         * Decides whether the rule(s) implemented by the strategy matches the supplied request.
         *
         * @returns true if the request matches, false otherwise
         */
        matches(request: Request): boolean;
    }
}
