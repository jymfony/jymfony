declare namespace Jymfony.Component.Config.Definition {
    export class ArrayNode extends BaseNode {
        protected _children: Record<string, NodeInterface>;
        protected _allowFalse: boolean;
        protected _allowNewKeys: boolean;
        protected _addIfNotSet: boolean;
        protected _performDeepMerging: boolean;
        protected _ignoreExtraKeys: boolean;
        protected _removeExtraKeys: boolean;
        protected _normalizeKeys: boolean;

        /**
         * @inheritdoc
         */
        __construct(name: string, parent?: NodeInterface): void;
        constructor(name: string, parent?: NodeInterface);

        setNormalizeKeys(normalizeKeys: boolean): void;

        /**
         * Normalizes keys between the different configuration formats.
         *
         * Namely, you mostly have foo_bar in YAML while you have foo-bar in XML.
         * After running this method, all keys are normalized to foo_bar.
         *
         * If you have a mixed key like foo-bar_moo, it will not be altered.
         * The key will also not be altered if the target key already exists.
         */
        protected _preNormalize(value: any): any;

        /**
         * Retrieves the children of this node.
         */
        getChildren(): Record<string, NodeInterface>;

        /**
         * Sets whether to add default values for this array if it has not been
         * defined in any of the configuration files.
         */
        setAddIfNotSet(bool: boolean): void;

        /**
         * Sets whether false is allowed as value indicating that the array should be unset.
         */
        setAllowFalse(allow: boolean): void;

        /**
         * Sets whether new keys can be defined in subsequent configurations.
         */
        setAllowNewKeys(allow: boolean): void;

        /**
         * Sets if deep merging should occur.
         */
        setPerformDeepMerging(bool: boolean): void;

        /**
         * Whether extra keys should just be ignore without an exception.
         */
        setIgnoreExtraKeys(bool: boolean, remove?: boolean): void;

        /**
         * Sets the node Name.
         */
        setName(name: string): void;

        /**
         * Checks if the node has a default value.
         */
        hasDefaultValue(): boolean;

        /**
         * Retrieves the default value.
         *
         * @throws {RuntimeException} if the node has no default value
         */
        getDefaultValue(): any;

        /**
         * Adds a child node.
         *
         * @throws {InvalidArgumentException} when the child node has no name or is not unique
         */
        addChild(node: NodeInterface): void;

        /**
         * Finalizes the value of this node.
         *
         * @throws {Jymfony.Component.Config.Definition.Exception.UnsetKeyException}
         * @throws {Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException} if the node doesn't have enough _children
         */
        finalizeValue(value: any): any;

        /**
         * @inheritdoc
         */
        validateType(value: any);

        /**
         * @inheritdoc
         */
        normalizeValue(value: any): any;

        /**
         * @inheritdoc
         */
        mergeValues(leftSide: any, rightSide: any): any;

    }
}
