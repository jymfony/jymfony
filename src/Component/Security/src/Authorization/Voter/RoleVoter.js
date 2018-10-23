const VoterInterface = Jymfony.Component.Security.Authorization.Voter.VoterInterface;
const Role = Jymfony.Component.Security.Role.Role;

/**
 * RoleVoter votes if any attribute starts with a given prefix.
 *
 * @memberOf Jymfony.Component.Security.Authorization.Voter
 */
class RoleVoter extends implementationOf(VoterInterface) {
    /**
     * Constructor.
     *
     * @param {string} [prefix = "ROLE_"]
     */
    __construct(prefix = 'ROLE_') {
        /**
         * @type {string}
         *
         * @private
         */
        this._prefix = prefix;
    }

    /**
     * @inheritdoc
     */
    vote(token, subject, attributes) {
        let result = VoterInterface.ACCESS_ABSTAIN;
        const roles = this._extractRoles(token);

        for (let attribute of Object.values(attributes)) {
            if (attribute instanceof Role) {
                attribute = attribute.toString();
            }

            if (! isString(attribute) || 0 !== attribute.indexOf(this._prefix)) {
                continue;
            }

            result = VoterInterface.ACCESS_DENIED;
            for (const role of roles) {
                if (attribute === role.toString()) {
                    return VoterInterface.ACCESS_GRANTED;
                }
            }
        }

        return result;
    }

    /**
     * @protected
     */
    _extractRoles(token) {
        return token.roles;
    }
}

module.exports = RoleVoter;
