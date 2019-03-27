declare namespace Jymfony.Component.Security.Role {
    /**
     * Represents a role hierarchy.
     */
    export class RoleHierarchy extends implementationOf(RoleHierarchyInterface) {
        private _hierarchy: Record<string, Set<string>>;

        /**
         * Constructor.
         */
        __construct(hierarchy: Record<string, string[]>): void;
        constructor(hierarchy: Record<string, string[]>);

        /**
         * @inheritdoc
         */
        getReachableRoles(roles: Role[]): Role[];

        /**
         * Builds a map for the reachable roles.
         */
        private _buildRoleMap(): void;
    }
}
