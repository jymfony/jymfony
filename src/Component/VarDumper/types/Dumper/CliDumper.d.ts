declare namespace Jymfony.Component.VarDumper.Dumper {
    import Cursor = Jymfony.Component.VarDumper.Cloner.Cursor;
    import WritableStream = NodeJS.WritableStream;
    import WriteStream = NodeJS.WriteStream;

    /**
     * CliDumper dumps variables for command line output.
     */
    export class CliDumper extends AbstractDumper {
        private static readonly _controlCharsRx: RegExp;
        private static readonly _controlCharsMap: Record<string, string>;
        private _colors: boolean;
        private _maxStringWidth: number;
        private _styles: Record<string, string>;
        private _collapseNextHash: boolean;
        private _expandNextHash: boolean;
        private _displayOptions: { };
        private _handlesHrefGracefully: undefined;

        /**
         * Constructor.
         */
        __construct(output?: number|WritableStream|string|Invokable, flags?: number): void;
        constructor(output?: number|WritableStream|string|Invokable, flags?: number);

        /**
         * Enables/disables colored output.
         */
        public colors: boolean;

        /**
         * Sets the maximum number of characters per line for dumped strings.
         */
        public /* writeonly */ maxStringWidth: number;

        /**
         * Configures styles.
         *
         * @param {Object.<string, string>} styles
         */
        public /* writeonly */ styles: Record<string, string>;

        /**
         * @inheritDoc
         */
        dumpScalar(cursor: Cursor, type: string, value: string|number|boolean): void;

        /**
         * @inheritDoc
         */
        dumpString(cursor: Cursor, str: string, cut: number): void;

        /**
         * @inheritDoc
         */
        enterHash(cursor: Cursor, type: number, class_: string, hasChild: boolean): void;

        /**
         * @inheritDoc
         */
        leaveHash(cursor: Cursor, type: number, class_: string, hasChild: boolean, cut: number): void;

        /**
         * Dumps an ellipsis for cut children.
         *
         * @param cursor The Cursor position in the dump
         * @param hasChild When the dump of the hash has child item
         * @param cut The number of items the hash has been cut by
         *
         * @protected
         */
        protected _dumpEllipsis(cursor: Cursor, hasChild: boolean, cut: number): void;

        protected _endValue(cursor: Cursor): void;

        protected _dumpLine(depth: number, endOfValue?: boolean): void;

        /**
         * Dumps a key in a hash structure.
         *
         * @param cursor The Cursor position in the dump
         */
        protected _dumpKey(cursor: Cursor): void;

        /**
         * Decorates a value with some style.
         *
         * @param style The type of style being applied
         * @param value The value being styled
         * @param attr Optional context information
         *
         * @returns The value with style decoration
         */
        protected _style(style: string, value: string, attr?: Record<string, string>): string;

        protected _supportsColors(): boolean;

        private _hasColorSupport(outputStream: WriteStream): boolean;

        private _isWindowsTrueColor(): boolean;
    }
}
