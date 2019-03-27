declare namespace Jymfony.Component.Config.Definition.Builder {
    /**
     * This class builds normalization conditions.
     */
    export class NormalizationBuilder<T extends NodeDefinition = any> {
        public node: T;
        public $before: (Invokable | ExprBuilder)[];
        public $remappings: [string, string][];

        /**
         * Constructor.
         */
        __construct(node: T): void;
        constructor(node: T);

        /**
         * Registers a key to remap to its plural form.
         *
         * @param key The key to remap
         * @param [plural] The plural of the key in case of irregular plural
         */
        remap(key: string, plural?: string): this;

        /**
         * Registers a closure to run before the normalization or an expression builder to build it if null is provided.
         */
        before(closure?: Invokable): this | ExprBuilder<T>;
    }
}
