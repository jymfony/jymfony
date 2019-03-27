declare namespace Jymfony.Component.Security.Authorization {
    import RequestMatcherInterface = Jymfony.Component.HttpFoundation.RequestMatcherInterface;
    import Request = Jymfony.Component.HttpFoundation.Request;

    /**
     * AccessMap allows configuration of different access control rules for
     * specific parts of the website.
     */
    export class AccessMap extends implementationOf(AccessMapInterface) {
        private _map: [RequestMatcherInterface, string[], undefined | string][];

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * Adds a request matcher to the access map.
         *
         * @param requestMatcher A RequestMatcherInterface instance
         * @param [attributes = []] An array of attributes to pass to the access decision manager (like roles)
         * @param [channel] The channel to enforce (http, https)
         */
        add(requestMatcher: RequestMatcherInterface, attributes?: string[], channel?: string | undefined): void;

        /**
         * @inheritdoc
         */
        getPatterns(request: Request): [string[], string | undefined];
    }
}
