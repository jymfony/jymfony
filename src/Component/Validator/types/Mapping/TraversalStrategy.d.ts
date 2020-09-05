declare namespace Jymfony.Component.Validator.Mapping {
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
     * @see {Jymfony.Component.Validator.Mapping.CascadingStrategy}
     */
    export class TraversalStrategy {
        /**
         * Specifies that a node's value should be iterated only if it implements {@link Symbol.iterator}.
         */
        public static readonly IMPLICIT: number;

        /**
         * Specifies that a node's value should never be iterated.
         */
        public static readonly NONE: number;

        /**
         * Specifies that a node's value should always be iterated. If the value is
         * not an instance of {@link IterableIterator}, an exception should be thrown.
         */
        public static readonly TRAVERSE: number;

        /**
         * Not instantiable.
         */
        private constructor();
    }
}
