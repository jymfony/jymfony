const NodeParentInterface = Jymfony.Component.Config.Definition.Builder.NodeParentInterface;
const ParentNodeDefinitionInterface = Jymfony.Component.Config.Definition.Builder.ParentNodeDefinitionInterface;

/**
 * This class provides a fluent interface for building a node.
 *
 * @memberOf Jymfony.Component.Config.Definition.Builder
 */
class NodeBuilder extends implementationOf(NodeParentInterface) {
    __construct() {
        this._nodeMapping = {
            'variable': 'Jymfony.Component.Config.Definition.Builder.VariableNodeDefinition',
            'scalar': 'Jymfony.Component.Config.Definition.Builder.ScalarNodeDefinition',
            'boolean': 'Jymfony.Component.Config.Definition.Builder.BooleanNodeDefinition',
            'integer': 'Jymfony.Component.Config.Definition.Builder.IntegerNodeDefinition',
            'float': 'Jymfony.Component.Config.Definition.Builder.FloatNodeDefinition',
            'array': 'Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition',
            'enum': 'Jymfony.Component.Config.Definition.Builder.EnumNodeDefinition',
        };

        /**
         * @type {Jymfony.Component.Config.Definition.Builder.ParentNodeDefinitionInterface}
         * @protected
         */
        this._parent = undefined;
    }

    /**
     * Set the parent node.
     *
     * @param {Jymfony.Component.Config.Definition.Builder.ParentNodeDefinitionInterface} parent
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeBuilder}
     */
    setParent(parent = undefined) {
        this._parent = parent;

        return this;
    }

    /**
     * Creates a child array node.
     *
     * @param {string} name The name of the node
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition} The child node
     */
    arrayNode(name) {
        return this.node(name, 'array');
    }

    /**
     * Creates a child scalar node.
     *
     * @param {string} name The name of the node
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ScalarNodeDefinition} The child node
     */
    scalarNode(name) {
        return this.node(name, 'scalar');
    }

    /**
     * Creates a child Boolean node.
     *
     * @param {string} name The name of the node
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.BooleanNodeDefinition} The child node
     */
    booleanNode(name) {
        return this.node(name, 'boolean');
    }

    /**
     * Creates a child integer node.
     *
     * @param {string} name The name of the node
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.IntegerNodeDefinition} The child node
     */
    integerNode(name) {
        return this.node(name, 'integer');
    }

    /**
     * Creates a child float node.
     *
     * @param {string} name The name of the node
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.FloatNodeDefinition} The child node
     */
    floatNode(name) {
        return this.node(name, 'float');
    }

    /**
     * Creates a child EnumNode.
     *
     * @param {string} name
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.EnumNodeDefinition}
     */
    enumNode(name) {
        return this.node(name, 'enum');
    }

    /**
     * Creates a child variable node.
     *
     * @param {string} name The name of the node
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.VariableNodeDefinition} The builder of the child node
     */
    variableNode(name) {
        return this.node(name, 'variable');
    }

    /**
     * Returns the parent node.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ParentNodeDefinitionInterface|Jymfony.Component.Config.Definition.Builder.NodeDefinition} The parent node
     */
    end() {
        return this._parent;
    }

    /**
     * Creates a child node.
     *
     * @param {string} name The name of the node
     * @param {string} type The type of the node
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition} The child node
     *
     * @throws {RuntimeException} When the node type is not registered
     * @throws {RuntimeException} When the node class is not found
     */
    node(name, type) {
        const $class = this._getNodeClass(type);
        const node = (new ReflectionClass($class)).newInstance(name);

        this.append(node);

        return node;
    }

    /**
     * Appends a node definition.
     *
     * Usage:
     *
     *     $node = new ArrayNodeDefinition('name')
     *         .children()
     *             .scalarNode('foo').end()
     *             .scalarNode('baz').end()
     *             .append(this.getBarNodeDefinition())
     *         .end()
     *     ;
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeBuilder}
     */
    append(node) {
        if (node instanceof ParentNodeDefinitionInterface) {
            const builder = __jymfony.clone(this);
            builder.setParent(undefined);
            node.setBuilder(builder);
        }

        if (undefined !== this._parent) {
            this._parent.append(node);
            // Make this builder the node parent to allow for a fluid interface
            node.setParent(this);
        }

        return this;
    }

    /**
     * Adds or overrides a node Type.
     *
     * @param {string} type  The name of the type
     * @param {string} className The fully qualified name the node definition class
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeBuilder}
     */
    setNodeClass(type, className) {
        this._nodeMapping[type.toLowerCase()] = className;

        return this;
    }

    /**
     * Returns the class name of the node definition.
     *
     * @param {string} type The node type
     *
     * @returns {string} The node definition class name
     *
     * @throws {RuntimeException} When the node type is not registered
     * @throws {RuntimeException} When the node class is not found
     *
     * @protected
     */
    _getNodeClass(type) {
        type = type.toLowerCase();

        if (undefined === this._nodeMapping[type]) {
            throw new RuntimeException(__jymfony.sprintf('The node type "%s" is not registered.', type));
        }

        const $class = this._nodeMapping[type];
        if (! ReflectionClass.exists($class)) {
            throw new RuntimeException(__jymfony.sprintf('The node class "%s" does not exist.', $class));
        }

        return $class;
    }
}

module.exports = NodeBuilder;
