declare namespace Jymfony.Component.Config.Definition.Builder {
    import NodeInterface = Jymfony.Component.Config.Definition.NodeInterface;

    /**
     * This class provides a fluent interface for defining a node.
     */
    export abstract class NodeDefinition<T extends NodeDefinition = any> extends implementationOf(NodeParentInterface) {
        protected _parent: T;
        protected _name: string;
        protected _normalization?: NormalizationBuilder<this>;
        protected _validation?: ValidationBuilder<this>;
        protected _default: any;
        protected _isDefault: boolean;
        protected _required: boolean;
        protected _deprecationMessage?: string;
        protected _merge?: MergeBuilder<this>;
        protected _allowEmptyValue: boolean;
        protected _nullEquivalent: any;
        protected _trueEquivalent: any;
        protected _falseEquivalent: any;
        protected _attributes: Record<any, any>;

        /**
         * Constructor.
         */
        __construct(name: string, parent?: T): void;
        constructor(name: string, parent?: T);

        /**
         * Sets the parent node.
         */
        setParent(parent: T): this;

        /**
         * Sets info message.
         *
         * @param info The info text
         */
        info(info: string): this;

        /**
         * Sets example configuration.
         *
         * @param example
         */
        example(example: any): this;

        /**
         * Sets an attribute on the node.
         */
        attribute(key: string, value: any): this;

        /**
         * Returns the parent node.
         */
        end(): NodeBuilder<T>;

        /**
         * Creates the node.
         *
         * @param [forceRootNode = false] Whether to force this node as the root node
         */
        getNode(forceRootNode?: boolean): NodeInterface;

        /**
         * Sets the default value.
         *
         * @param value The default value
         */
        defaultValue(value: any): this;

        /**
         * Sets the node as required.
         */
        isRequired(): this

        /**
         * Sets the node as deprecated.
         *
         * You can use %node% and %path% placeholders in your message to display,
         * respectively, the node name and its complete path.
         *
         * @param [message = 'The child node "%node%" at path "%path%" is deprecated.'] Deprecation message
         */
        setDeprecated(message?: string): this;

        /**
         * Sets the equivalent value used when the node contains null.
         */
        treatNullLike(value: any): this;

        /**
         * Sets the equivalent value used when the node contains true.
         */
        treatTrueLike(value: any): this;

        /**
         * Sets the equivalent value used when the node contains false.
         */
        treatFalseLike(value: any): this;

        /**
         * Sets null as the default value.
         */
        defaultNull(): this;

        /**
         * Sets undefined as the default value.
         */
        defaultUndefined(): this;

        /**
         * Sets true as the default value.
         */
        defaultTrue(): this;

        /**
         * Sets false as the default value.
         */
        defaultFalse(): this;

        /**
         * Sets an expression to run before the normalization.
         */
        beforeNormalization(): ExprBuilder<this>;

        /**
         * Denies the node value being empty.
         */
        cannotBeEmpty(): this;

        /**
         * Sets an expression to run for the validation.
         *
         * The expression receives the value of the node and must return it. It can modify it.
         * An exception should be thrown when the node is not valid.
         */
        validate(): ExprBuilder<this>;

        /**
         * Sets whether the node can be overwritten.
         *
         * @param [deny = true] Whether the overwriting is forbidden or not
         */
        cannotBeOverwritten(deny?: boolean): this;

        /**
         * Gets the builder for validation rules.
         */
        protected validation(): ValidationBuilder<this>;

        /**
         * Gets the builder for merging rules.
         */
        protected merge(): MergeBuilder<this>;

        /**
         * Gets the builder for normalization rules.
         */
        protected normalization(): NormalizationBuilder<this>;

        /**
         * Instantiate and configure the node according to this definition.
         *
         * @throws {Jymfony.Component.Config.Exception.InvalidDefinitionException} When the definition is invalid
         */
        protected abstract createNode(): NodeInterface;
    }
}
