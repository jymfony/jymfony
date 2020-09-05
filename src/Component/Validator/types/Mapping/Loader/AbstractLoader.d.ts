declare namespace Jymfony.Component.Validator.Mapping.Loader {
    import LoaderInterface = Jymfony.Component.Metadata.Loader.LoaderInterface;

    /**
     * The namespace to load constraints from by default.
     */
    const DEFAULT_NAMESPACE: string;

    /**
     * Base loader for validation metadata.
     *
     * This loader supports the loading of constraints from Jymfony's default
     * namespace (see {@link DEFAULT_NAMESPACE}) using the short class names of
     * those constraints. Constraints can also be loaded using their fully
     * qualified class names. At last, namespace aliases can be defined to load
     * constraints with the syntax "alias:ShortName".
     */
    export abstract class AbstractLoader extends implementationOf(LoaderInterface) {
        protected _namespaces: Record<string, string>;

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * Adds a namespace alias.
         *
         * The namespace alias can be used to reference constraints from specific
         * namespaces in {@link _newConstraint()}:
         *
         *     this._addNamespaceAlias('mynamespace', 'Acme.Package.Constraints.');
         *     const constraint = this._newConstraint('mynamespace:NotNull');
         */
        protected _addNamespaceAlias(alias: string, namespace: string): void;

        /**
         * Creates a new constraint instance for the given constraint name.
         *
         * @param name The constraint name. Either a constraint relative
         *             to the default constraint namespace, or a fully
         *             qualified class name. Alternatively, the constraint
         *             may be preceded by a namespace alias and a colon.
         *             The namespace alias must have been defined using
         *             {@link _addNamespaceAlias()}.
         * @param options The constraint options
         *
         * @throws {Jymfony.Component.Validator.Exception.MappingException} If the namespace prefix is undefined
         *
         * @protected
         */
        protected _newConstraint(name: string, options?: null | Record<string, any>): Constraint;
    }
}
