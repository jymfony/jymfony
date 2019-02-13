declare namespace Jymfony.Component.Config.Definition.Builder {
    /**
     * This class builds validation conditions.
     */
    export class ValidationBuilder<T extends NodeDefinition = any> {
        public rules: (Invokable | ExprBuilder<T>)[];
        protected _node: T;

        /**
         * Constructor.
         */
        __construct(node: T): void;
        constructor(node: T);

        /**
         * Sets whether the node can be unset.
         */
        rule(closure?: Invokable): ExprBuilder<T> | this;
    }
}
