/**
 * @memberOf Jymfony.Component.Security.Authorization.Voter
 */
class VoterInterface {
    /**
     * Returns the vote for the given parameters.
     *
     * This method must return one of the following constants:
     * ACCESS_GRANTED, ACCESS_DENIED, or ACCESS_ABSTAIN.
     *
     * @param {Jymfony.Component.Security.Authentication.Token.TokenInterface} token A TokenInterface instance
     * @param {*} subject    The subject to secure
     * @param {Array} attributes An array of attributes associated with the method being invoked
     *
     * @returns {int} either ACCESS_GRANTED, ACCESS_ABSTAIN, or ACCESS_DENIED
     */
    vote(token, subject, attributes) { }
}

VoterInterface.ACCESS_GRANTED = 1;
VoterInterface.ACCESS_ABSTAIN = 0;
VoterInterface.ACCESS_DENIED = -1;

export default getInterface(VoterInterface);
