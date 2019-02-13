declare namespace Jymfony.Component.Config.Definition {
    /**
     * Represents a prototyped Array node in the config tree.
     */
    export class PrototypedArrayNode extends ArrayNode {
        private _prototype?: NodeInterface;
        private _keyAttribute?: string;
        private _removeKeyAttribute: boolean;
        private _minNumberOfElements: number;
        private _defaultValue: any;
        private _defaultChildren: any[];

        /**
         * @type {Object.}
         *
         * @private
         */
        private _valuePrototypes: Record<string, NodeInterface>;

        /**
         * @inheritdoc
         */
        __construct(name: string, parent?: NodeInterface): void;
        constructor(name: string, parent?: NodeInterface);

        /**
         * Sets the minimum number of elements that a prototype based node must
         * contain. By default this is zero, meaning no elements.
         */
        setMinNumberOfElements(number: number): void;

        /**
         * Sets the attribute which value is to be used as key.
         *
         * This is useful when you have an array that should be an object.
         * You can select an item from within the object to be the key of
         * the particular item. For example, if "id" is the "key", then:
         *
         *     [
         *         {id: "my_name", foo: "bar"},
         *     ];
         *
         *  becomes
         *
         *      {
         *          'my_name': {'foo': 'bar'},
         *      };
         *
         * If you'd like "'id': 'my_name'" to still be present in the resulting
         * array, then you can set the second argument of this method to false.
         *
         * @param attribute The name of the attribute which value is to be used as a key
         * @param remove Whether or not to remove the key
         */
        setKeyAttribute(attribute: string, remove?: boolean): void;

        /**
         * Retrieves the name of the attribute which value should be used as key.
         */
        getKeyAttribute(): string;

        /**
         * Sets the default value of this node.
         *
         * @throws {InvalidArgumentException} if the default value is not an array
         */
        setDefaultValue(value: string): void;

        /**
         * @inheritdoc
         */
        hasDefaultValue(): boolean;

        /**
         * Adds default children when none are set.
         *
         * @param children The number of children|The child name|The children names to be added
         */
        setAddChildrenIfNoneSet(children?: any): void;

        /**
         * @inheritdoc
         *
         * The default value could be either explicited or derived from the prototype
         * default value.
         */
        getDefaultValue(): any;

        /**
         * Sets the node prototype.
         */
        setPrototype(node: NodeInterface): void;

        /**
         * Retrieves the prototype.
         */
        getPrototype(): NodeInterface;

        /**
         * Disable adding concrete children for prototyped nodes.
         *
         * @throws {Jymfony.Component.Config.Definition.Exception.Exception}
         */
        addChild(node: NodeInterface): void;

        /**
         * Finalizes the value of this node.
         *
         * @throws {Jymfony.Component.Config.Definition.Exception.UnsetKeyException}
         * @throws {Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException} if the node doesn't have enough children
         */
        finalizeValue(value: any): any;

        /**
         * Normalizes the value.
         *
         * @throws {Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException}
         * @throws {Jymfony.Component.Config.Definition.Exception.DuplicateKeyException}
         */
        normalizeValue(value: any): any;

        /**
         * @inheritdoc
         *
         * @throws {Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException}
         * @throws {RuntimeException}
         */
        mergeValues(leftSide: any, rightSide: any): any;

        /**
         * Returns a prototype for the child node that is associated to key in the value array.
         * For general child nodes, this will be this._prototype.
         * But if this._removeKeyAttribute is true and there are only two keys in the child node:
         * one is same as this._keyAttribute and the other is 'value', then the prototype will be different.
         *
         * For example, assume this._keyAttribute is 'name' and the value array is as follows:
         * [
         *     {
         *         'name': 'name001',
         *         'value': 'value001'
         *     }
         * ]
         *
         * Now, the key is 0 and the child node is:
         * {
         *    'name': 'name001',
         *    'value': 'value001'
         * }
         *
         * When normalizing the value array, the 'name' element will removed from the child node
         * and its value becomes the new key of the child node:
         * {
         *     'name001': {'value' => 'value001'}
         * }
         *
         * Now only 'value' element is left in the child node which can be further simplified into a string:
         * {'name001': 'value001'}
         *
         * Now, the key becomes 'name001' and the child node becomes 'value001' and
         * the prototype of child node 'name001' should be a ScalarNode instead of an ArrayNode instance.
         */
        private _getPrototypeForChild(key: string): NodeInterface;
    }
}
