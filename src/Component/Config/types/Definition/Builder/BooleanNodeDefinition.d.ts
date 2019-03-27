declare namespace Jymfony.Component.Config.Definition.Builder {
    import BooleanNode = Jymfony.Component.Config.Definition.BooleanNode;

    /**
     * This class provides a fluent interface for defining a node.
     */
    export class BooleanNodeDefinition<T extends NodeDefinition = any> extends ScalarNodeDefinition<T> {
        /**
         * Constructor.
         */
        __construct(name: string, parent?: T): void;
        constructor(name: string, parent?: T);

        /**
         * @inheritdoc
         */
        instantiateNode(): BooleanNode;

        /**
         * Denies the node value being empty.
         *
         * @throws {Jymfony.Component.Config.Definition.Exception.InvalidDefinitionException}
         */
        cannotBeEmpty(): this;
    }
}
