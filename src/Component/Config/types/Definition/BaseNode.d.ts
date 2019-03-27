declare namespace Jymfony.Component.Config.Definition {
    /**
     * The base node class.
     */
    export abstract class BaseNode extends implementationOf(NodeInterface) {
        protected _name: string;
        protected _parent: NodeInterface|undefined;
        private _normalizationClosures: Invokable[];
        private _finalValidationClosures: Invokable[];
        private _allowOverwrite: boolean;
        private _required: boolean;
        private _deprecationMessage: string|undefined;
        private _equivalentValues: [any, any][];
        private _attributes: Record<any, any>;

        /**
         * Constructor.
         *
         * @throws {InvalidArgumentException} if the name contains a period
         */
        __construct(name: string, parent?: NodeInterface): void;
        constructor(name: string, parent?: NodeInterface);

        setAttribute(key: any, value: any): void;
        getAttribute(key: any, defaultValue?: any): any;
        hasAttribute(key: any): boolean;
        getAttributes(): Record<any, any>;
        setAttributes(_attributes: Record<any, any>): void;
        removeAttribute(key: any): void;

        /**
         * Sets an info message.
         */
        setInfo(info: string): void;

        /**
         * Returns info message.
         */
        getInfo(): string;

        /**
         * Sets the example configuration for this node.
         */
        setExample(example: string|string[]): void;

        /**
         * Retrieves the example configuration for this node.
         */
        getExample(): string|string[];

        /**
         * Adds an equivalent value.
         */
        addEquivalentValue(originalValue: any, equivalentValue: any): void;

        /**
         * Set this node as _required.
         */
        setRequired(bool: boolean): void;

        /**
         * Sets this node as deprecated.
         *
         * You can use %node% and %path% placeholders in your message to display,
         * respectively, the node name and its complete path.
         */
        setDeprecated(message: string|undefined): void;

        /**
         * Sets if this node can be overridden.
         */
        setAllowOverwrite(allow: boolean): void;

        /**
         * Sets the closures used for normalization.
         */
        setNormalizationClosures(closures: Invokable[]): void;

        /**
         * Sets the closures used for final validation.
         *
         * @param closures An array of Closures used for final validation
         */
        setFinalValidationClosures(closures: Invokable[]): void;

        /**
         * Checks if this node is _required.
         */
        isRequired(): boolean;

        /**
         * Checks if this node is deprecated.
         */
        isDeprecated(): boolean;

        /**
         * Returns the deprecated message.
         *
         * @param node the configuration node name
         * @param path the path of the node
         */
        getDeprecationMessage(node: string, path: string): string;

        /**
         * Returns the name of this node.
         */
        getName(): string;

        /**
         * Retrieves the path of this node.
         */
        getPath(): string;

        /**
         * Merges two values together.
         *
         * @throws {Jymfony.Component.Config.Definition.Exception.ForbiddenOverwriteException}
         *
         * @final
         */
        merge(leftSide: any, rightSide: any): any;

        /**
         * Normalizes a value, applying all normalization closures.
         */
        normalize(value: any): any;

        /**
         * Normalizes the value before any other normalization is applied.
         */
        protected _preNormalize(value: any): any;

        /**
         * Returns parent node for this node.
         */
        getParent(): NodeInterface|undefined;

        /**
         * Finalizes a value, applying all finalization closures.
         *
         * @throws {Exception}
         * @throws {Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException}
         *
         * @final
         */
        finalize(value: any): any;

        /**
         * Validates the type of a Node.
         *
         * @throws {Jymfony.Component.Config.Definition.Exception.InvalidTypeException} when the value is invalid
         */
        abstract validateType(value: any);

        /**
         * Normalizes the value.
         */
        abstract normalizeValue(value: any): any;

        /**
         * Merges two values together.
         */
        abstract mergeValues(leftSide: any, rightSide: any): any;

        /**
         * Finalizes a value.
         */
        abstract finalizeValue(value: any): any;
    }
}
