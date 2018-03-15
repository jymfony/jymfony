
/**
 * Common Interface among all nodes.
 *
 * In most cases, it is better to inherit from BaseNode instead of implementing
 * this interface yourself.
 *
 * @memberOf Jymfony.Component.Config.Definition
 */
class NodeInterface {
    /**
     * Returns the name of the node.
     *
     * @returns {string} The name of the node
     */
    getName() { }

    /**
     * Returns the path of the node.
     *
     * @returns {string} The node path
     */
    getPath() { }

    /**
     * Returns true when the node is required.
     *
     * @returns {boolean} If the node is required
     */
    isRequired() { }

    /**
     * Returns true when the node has a default value.
     *
     * @returns {boolean} If the node has a default value
     */
    hasDefaultValue() { }

    /**
     * Returns the default value of the node.
     *
     * @returns {*} The default value
     *
     * @throws {RuntimeException} if the node has no default value
     */
    getDefaultValue() { }

    /**
     * Normalizes the supplied value.
     *
     * @param {*} value The value to normalize
     *
     * @returns {*} The normalized value
     */
    normalize(value) { }

    /**
     * Merges two values together.
     *
     * @param {*} leftSide
     * @param {*} rightSide
     *
     * @returns {*} The merged values
     */
    merge(leftSide, rightSide) { }

    /**
     * Finalizes a value.
     *
     * @param {*} value The value to finalize
     *
     * @returns {*} The finalized value
     */
    finalize(value) { }
}

module.exports = getInterface(NodeInterface);
