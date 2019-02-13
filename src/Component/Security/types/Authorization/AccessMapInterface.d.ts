declare namespace Jymfony.Component.Security.Authorization {
    import Request = Jymfony.Component.HttpFoundation.Request;

    /**
     * AccessMap allows configuration of different access control rules for
     * specific parts of the website.
     */
    export class AccessMapInterface implements MixinInterface {
        public static readonly definition: Newable<AccessMapInterface>;

        /**
         * Returns security attributes and required channel for the supplied request.
         *
         * @returns A tuple of security attributes and the required channel
         */
        getPatterns(request: Request): [string[], undefined | string];
    }
}
