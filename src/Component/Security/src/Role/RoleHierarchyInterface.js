/**
 * Represents a role hierarchy.
 *
 * @memberOf Jymfony.Component.Security.Role
 */
class RoleHierarchyInterface {
    /**
     * Returns an array of all reachable roles by the given ones.
     *
     * Reachable roles are the roles directly assigned but also all roles that
     * are transitively reachable from them in the role hierarchy.
     *
     * @param {Jymfony.Component.Security.Role.Role[]} roles An array of directly assigned roles
     *
     * @returns {Jymfony.Component.Security.Role.Role[]} An array of all reachable roles
     */
    getReachableRoles(roles) { }
}

export default getInterface(RoleHierarchyInterface);
