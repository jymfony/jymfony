/**
 * Specifies whether and how a traversable object should be traversed.
 *
 * If the node traverser traverses a node whose value implements
 * {@link Symbol.iterator}, and if that node is either a class node or if
 * cascading is enabled, then the node's traversal strategy will be checked.
 * Depending on the requested traversal strategy, the node traverser will
 * iterate over the object and cascade each object or collection returned by
 * the iterator.
 *
 * The traversal strategy is ignored for arrays. Arrays are always iterated.
 *
 * @memberOf Jymfony.Component.Validator.Mapping
 *
 * @see {Jymfony.Component.Validator.Mapping.CascadingStrategy}
 */
export default class TraversalStrategy {
    /**
     * Not instantiable.
     */
    __construct() {
        throw new Error('Not instantiable.');
    }
}

/**
 * Specifies that a node's value should be iterated only if it implements {@link Symbol.iterator}.
 */
TraversalStrategy.IMPLICIT = 1;

/**
 * Specifies that a node's value should never be iterated.
 */
TraversalStrategy.NONE = 2;

/**
 * Specifies that a node's value should always be iterated. If the value is
 * not an instance of {@link Symbol.iterator}, an exception should be thrown.
 */
TraversalStrategy.TRAVERSE = 4;
