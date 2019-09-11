const Role = Jymfony.Component.Security.Role.Role;
const RoleHierarchyInterface = Jymfony.Component.Security.Role.RoleHierarchyInterface;

/**
 * Represents a role hierarchy.
 *
 * @memberOf Jymfony.Component.Security.Role
 */
export default class RoleHierarchy extends implementationOf(RoleHierarchyInterface) {
    /**
     * Constructor.
     *
     * @param {Object.<string, string[]>} hierarchy
     */
    __construct(hierarchy) {
        /**
         * @type {Object.<string, Set<string>>}
         *
         * @private
         */
        this._hierarchy = {};
        for (const [ role, children ] of __jymfony.getEntries(hierarchy)) {
            this._hierarchy[role] = new Set(children);
        }

        this._buildRoleMap();
    }

    /**
     * @inheritdoc
     */
    getReachableRoles(roles) {
        const reachableRoles = [ ...roles ];
        for (const role of roles) {
            if (! this._map[role.toString()]) {
                continue;
            }

            for (const r of this._map[role.toString()]) {
                reachableRoles.push(new Role(r));
            }
        }

        return reachableRoles;
    }

    /**
     * Builds a map for the reachable roles.
     *
     * @private
     */
    _buildRoleMap() {
        this._map = {};

        for (const [ main, roles ] of __jymfony.getEntries(this._hierarchy)) {
            this._map[main] = roles;

            const visited = new Set();
            const additionalRoles = [ ...roles ];

            let role;
            while ((role = additionalRoles.shift())) {
                if (! this._hierarchy[role]) {
                    continue;
                }

                visited.add(role);

                for (const roleToAdd of this._hierarchy[role]) {
                    this._map[main].add(roleToAdd);
                }

                for (const additionalRole of [ ...this._hierarchy[role] ].filter(r => ! visited.has(r))) {
                    additionalRoles.push(additionalRole);
                }
            }
        }
    }
}
