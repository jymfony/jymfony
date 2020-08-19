declare namespace Jymfony.Component.Config.Definition {
    import TreeBuilder = Jymfony.Component.Config.Definition.Builder.TreeBuilder;

    export class ConfigurationInterface {
        public static readonly definition: Newable<ConfigurationInterface>;

        /**
         * Generates the configuration tree builder.
         */
        readonly configTreeBuilder: TreeBuilder;
    }
}
