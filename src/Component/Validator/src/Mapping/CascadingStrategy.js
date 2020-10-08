/**
 * Specifies whether an object should be cascaded.
 *
 * Cascading is relevant for any node type but class nodes. If such a node
 * contains an object of value, and if cascading is enabled, then the node
 * traverser will try to find class metadata for that object and validate the
 * object against that metadata.
 *
 * If no metadata is found for a cascaded object, and if that object implements
 * {@link Symbol.iterator}, the node traverser will iterate over the object and
 * cascade each object or collection contained within, unless iteration is
 * prohibited by the specified {@link Jymfony.Component.Validator.Mapping.TraversalStrategy}.
 *
 * Although the constants currently represent a boolean switch, they are
 * implemented as bit mask in order to allow future extensions.
 *
 * @memberOf Jymfony.Component.Validator.Mapping
 *
 * @see {Jymfony.Component.Validator.Mapping.TraversalStrategy}
 */
export default class CascadingStrategy {
    /**
     * Not instantiable.
     */
    __construct() {
        throw new Error('Not instantiable.');
    }
}

/**
 * Specifies that a node should not be cascaded.
 */
CascadingStrategy.NONE = 1;

/**
 * Specifies that a node should be cascaded.
 */
CascadingStrategy.CASCADE = 2;
