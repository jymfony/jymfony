const RoleVoter = Jymfony.Component.Security.Authorization.Voter.RoleVoter;

/**
 * RoleHierarchyVoter uses a RoleHierarchy to determine the roles granted to
 * the user before voting.
 *
 * @memberOf Jymfony.Component.Security.Authorization.Voter
 */
export default class RoleHierarchyVoter extends RoleVoter {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Security.Role.RoleHierarchyInterface} roleHierarchy
     * @param {string} [prefix = "ROLE_"]
     */
    __construct(roleHierarchy, prefix = 'ROLE_') {
        /**
         * @type {Jymfony.Component.Security.Role.RoleHierarchyInterface}
         *
         * @private
         */
        this._roleHierarchy = roleHierarchy;

        super.__construct(prefix);
    }

    /**
     * @inheritdoc
     */
    _extractRoles(token) {
        return this._roleHierarchy.getReachableRoles(token.roles);
    }
}
