/**
 * Defines the interface for a group sequence provider.
 *
 * @memberOf Jymfony.Component.Validator
 */
class GroupSequenceProviderInterface {
    /**
     * Returns which validation groups should be used for a certain state
     * of the object.
     *
     * @returns {string[]|string[][]|Jymfony.Component.Validator.Constraints.GroupSequence} An array of validation groups
     */
    get groupSequence() { }
}

export default getInterface(GroupSequenceProviderInterface);
