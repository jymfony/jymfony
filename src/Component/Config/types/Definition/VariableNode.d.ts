declare namespace Jymfony.Component.Config.Definition {
    export class VariableNode extends BaseNode {
        protected _defaultValueSet: boolean;
        protected _allowEmptyValue: boolean;
        protected _defaultValue: any;

        /**
         * @inheritdoc
         */
        __construct(name: string, parent?: NodeInterface): void;
        constructor(name: string, parent?: NodeInterface);

        /**
         * @inheritdoc
         */
        setDefaultValue(value: any): void;

        /**
         * @inheritdoc
         */
        hasDefaultValue(): boolean;

        /**
         * @inheritdoc
         */
        getDefaultValue(): any;

        /**
         * Sets if this node is allowed to have an empty value.
         *
         * @param bool True if this entity will accept empty values
         */
        setAllowEmptyValue(bool: boolean): void;

        /**
         * @inheritdoc
         */
        setName(name: string): void;

        /**
         * @inheritdoc
         */
        validateType(value: any): void;

        /**
         * @inheritdoc
         */
        finalizeValue(value: any): any;

        /**
         * @inheritdoc
         */
        normalizeValue(value: any): any;

        /**
         * @inheritdoc
         */
        mergeValues(leftSide: any, rightSide: any): any;

        /**
         * Evaluates if the given value is to be treated as empty.
         *
         * By default, boolean cast is used to test for emptiness. This
         * method may be overridden by subtypes to better match their understanding
         * of empty data.
         */
        isValueEmpty(value: any): boolean;
    }
}
