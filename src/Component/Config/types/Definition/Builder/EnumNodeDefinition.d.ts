declare namespace Jymfony.Component.Config.Definition.Builder {
    import EnumNode = Jymfony.Component.Config.Definition.EnumNode;

    /**
     * Enum Node Definition.
     *
     * @memberOf Jymfony.Component.Config.Definition.Builder
     */
    export class EnumNodeDefinition<T extends NodeDefinition = any> extends ScalarNodeDefinition<T> {
        private _values: any[];

        /**
         * Constructor.
         */
        __construct(name: string, parent?: T): void;
        constructor(name: string, parent?: T);

        /**
         * Sets allowed values for this node.
         */
        values(values: any[]): this;

        /**
         * @inheritdoc
         */
        instantiateNode(): EnumNode;
    }
}
