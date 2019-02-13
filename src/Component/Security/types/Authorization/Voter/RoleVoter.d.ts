declare namespace Jymfony.Component.Security.Authorization.Voter {
    import TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;
    import Role = Jymfony.Component.Security.Role.Role;

    /**
     * RoleVoter votes if any attribute starts with a given prefix.
     */
    export class RoleVoter extends implementationOf(VoterInterface) {
        private _prefix: string;

        /**
         * Constructor.
         */
        __construct(prefix?: string): void;
        constructor(prefix?: string);

        /**
         * @inheritdoc
         */
        vote(token: TokenInterface, subject: any, attributes: Record<string, any>): number;

        /**
         * @protected
         */
        protected _extractRoles(token: TokenInterface): Role[];
    }
}
