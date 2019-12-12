declare namespace Jymfony.Component.Yaml.Tag {
    /**
     * @memberOf Jymfony.Component.Yaml.Tag
     */
    export class TaggedValue {
        private _tag: string;
        private _value: any;

        /**
         * Gets the tag.
         */
        public readonly tag: string;

        /**
         * Gets the value.
         */
        public readonly value: any;

        /**
         * Constructor.
         */
        __construct(tag: string, value: any): void;
        constructor(tag: string, value: any);
    }
}
