declare namespace Jymfony.Component.Config.Definition.Builder {
    /**
     * This class builds merge conditions.
     */
    export class MergeBuilder<T extends NodeDefinition = any> {
        public allowFalse: boolean;
        public allowOverwrite: boolean;
        protected _node: T;

        /**
         * Constructor.
         */
        __construct(node: T): void;
        constructor(node: T);

        /**
         * Sets whether the node can be unset.
         */
        allowUnset(allow?: boolean): this;

        /**
         * Sets whether the node can be overwritten.
         */
        denyOverwrite(deny?: boolean): this;

        /**
         * Returns the related node.
         */
        end(): T;
    }
}
