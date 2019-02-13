declare namespace Jymfony.Component.Config.Definition {
    /**
     * Node which only allows a finite set of values.
     */
    export class EnumNode extends ScalarNode {
        private _value: any[];

        /**
         * Constructor.
         */
        __construct(name: string, parent?: NodeInterface, values?: any[]): void;

        getValues(): any[];

        /**
         * @inheritdoc
         */
        finalizeValue(value: any): any;
    }
}
