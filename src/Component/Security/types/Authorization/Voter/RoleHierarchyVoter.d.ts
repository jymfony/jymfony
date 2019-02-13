declare namespace Jymfony.Component.Security.Authorization.Voter {
    import RoleHierarchyInterface = Jymfony.Component.Security.Role.RoleHierarchyInterface;
    import TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;
    import Role = Jymfony.Component.Security.Role.Role;

    /**
     * RoleHierarchyVoter uses a RoleHierarchy to determine the roles granted to
     * the user before voting.
     */
    export class RoleHierarchyVoter extends RoleVoter {
        private _roleHierarchy: RoleHierarchyInterface;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(roleHierarchy: RoleHierarchyInterface, prefix?: string): void;
        constructor(roleHierarchy: RoleHierarchyInterface, prefix?: string);

        /**
         * @inheritdoc
         */
        protected _extractRoles(token: TokenInterface): Role[];
    }
}
