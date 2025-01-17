const LoaderInterface = Jymfony.Component.Metadata.Loader.LoaderInterface;
const MappingException = Jymfony.Component.Validator.Exception.MappingException;

/**
 * The namespace to load constraints from by default.
 */
const DEFAULT_NAMESPACE = 'Jymfony.Component.Validator.Constraints.';

/**
 * Base loader for validation metadata.
 *
 * This loader supports the loading of constraints from Jymfony's default
 * namespace (see {@link DEFAULT_NAMESPACE}) using the short class names of
 * those constraints. Constraints can also be loaded using their fully
 * qualified class names. At last, namespace aliases can be defined to load
 * constraints with the syntax "alias:ShortName".
 *
 * @abstract
 * @memberOf Jymfony.Component.Validator.Mapping.Loader
 */
export default class AbstractLoader extends implementationOf(LoaderInterface) {
    /**
     * @type {Object.<string, string>}
     *
     * @protected
     */
    _namespaces = {};

    /**
     * Adds a namespace alias.
     *
     * The namespace alias can be used to reference constraints from specific
     * namespaces in {@link _newConstraint()}:
     *
     *     this._addNamespaceAlias('mynamespace', 'Acme.Package.Constraints.');
     *     const constraint = this._newConstraint('mynamespace:NotNull');
     *
     * @param {string} alias
     * @param {string} namespace
     *
     * @protected
     */
    _addNamespaceAlias(alias, namespace) {
        this._namespaces[alias] = namespace;
    }

    /**
     * Creates a new constraint instance for the given constraint name.
     *
     * @param {string} name The constraint name. Either a constraint relative
     *                      to the default constraint namespace, or a fully
     *                      qualified class name. Alternatively, the constraint
     *                      may be preceded by a namespace alias and a colon.
     *                      The namespace alias must have been defined using
     *                      {@link _addNamespaceAlias()}.
     * @param {*} options   The constraint options
     *
     * @returns {Jymfony.Component.Validator.Constraint}
     *
     * @throws {Jymfony.Component.Validator.Exception.MappingException} If the namespace prefix is undefined
     *
     * @protected
     */
    _newConstraint(name, options = null) {
        let className, prefix;
        if (-1 !== name.indexOf('.') && ReflectionClass.exists(name)) {
            className = name;
        } else if (-1 !== name.indexOf(':')) {
            [ prefix, className ] = name.split(':', 2);

            if (undefined === this._namespaces[prefix]) {
                throw new MappingException(__jymfony.sprintf('Undefined namespace prefix "%s".', prefix));
            }

            className = this._namespaces[prefix] + className;
        } else {
            className = DEFAULT_NAMESPACE + name;
        }

        return new (ReflectionClass.getClass(className))(options);
    }
}
