declare namespace Jymfony.Component.Config.Definition {
    /**
     * Common Interface among all nodes.
     *
     * In most cases, it is better to inherit from BaseNode instead of implementing
     * this interface yourself.
     */
    export class NodeInterface {
        /**
         * Returns the name of the node.
         *
         * @returns The name of the node
         */
        getName(): string;

        /**
         * Returns the path of the node.
         *
         * @returns The node path
         */
        getPath(): string;

        /**
         * Returns true when the node is required.
         *
         * @returns If the node is required
         */
        isRequired(): boolean;

        /**
         * Returns true when the node has a default value.
         *
         * @returns If the node has a default value
         */
        hasDefaultValue(): boolean;

        /**
         * Returns the default value of the node.
         *
         * @returns The default value
         *
         * @throws {RuntimeException} if the node has no default value
         */
        getDefaultValue(): any;

        /**
         * Normalizes the supplied value.
         *
         * @param value The value to normalize
         *
         * @returns The normalized value
         */
        normalize(value: any): any;

        /**
         * Merges two values together.
         *
         * @param leftSide
         * @param rightSide
         *
         * @returns The merged values
         */
        merge(leftSide: any, rightSide: any): any;

        /**
         * Finalizes a value.
         *
         * @param value The value to finalize
         *
         * @returns The finalized value
         */
        finalize(value: any): any;
    }
}
