/**
 * @memberOf Jymfony.Config.Resource
 * @type {Jymfony.Config.Resource.ResourceInterface}
 */
class ResourceInterface {
    /**
     * Returns a string representation of the Resource.
     *
     * This method is necessary to allow for resource de-duplication.
     * The string returned need not have a particular meaning, but has
     * to be identical for different ResourceInterface instances
     * referring to the same resource; and it should be unlikely to
     * collide with that of other, unrelated resource instances.
     *
     * @returns {string} A string representation unique to the underlying Resource
     */
    toString() { }
}

module.exports = getInterface(ResourceInterface);
