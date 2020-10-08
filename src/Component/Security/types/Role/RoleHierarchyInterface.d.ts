declare namespace Jymfony.Component.Security.Role {
    /**
     * Represents a role hierarchy.
     */
    export class RoleHierarchyInterface {
        public static readonly definition: Newable<RoleHierarchyInterface>;

        /**
         * Returns an array of all reachable roles by the given ones.
         *
         * Reachable roles are the roles directly assigned but also all roles that
         * are transitively reachable from them in the role hierarchy.
         *
         * @param roles An array of directly assigned roles
         *
         * @returns An array of all reachable roles
         */
        getReachableRoles(roles: Role[]): Role[];
    }
}
