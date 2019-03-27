declare namespace Jymfony.Component.Security.Role {
    import TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;

    /**
     * SwitchUserRole is used when the current user temporarily impersonates
     * another one.
     */
    export class SwitchUserRole extends Role {
        private _source: TokenInterface;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(role: string, token: TokenInterface): void;
        constructor(role: string, token: TokenInterface);

        /**
         * Gets the source token.
         *
         * @returns {Jymfony.Component.Security.Authorization.Token.TokenInterface}
         */
        public readonly source: TokenInterface;
    }
}
