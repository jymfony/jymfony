declare namespace Jymfony.Component.VarDumper.Dumper {
    import Data = Jymfony.Component.VarDumper.Cloner.Data;
    import Cursor = Jymfony.Component.VarDumper.Cloner.Cursor;
    import WritableStream = NodeJS.WritableStream;

    /**
     * HtmlDumper dumps variables as HTML.
     */
    export class HtmlDumper extends CliDumper {
        public static themes: Record<string, Record<string, string>>;

        protected _dumpHeader: string;
        protected _dumpPrefix: string;
        protected _dumpSuffix: string;
        protected _dumpId: string;
        protected _headerIsDumped: boolean;
        protected _lastDepth: number;
        private _extraDisplayOptions: Record<string, any>;

        /**
         * Constructor.
         */
        __construct(output?: number|WritableStream|string|Invokable, flags?: number): void;
        constructor(output?: number|WritableStream|string|Invokable, flags?: number);

        public /* writeonly */ styles: Record<string, any>;
        public /* writeonly */ theme: string;

        /**
         * Configures display options.
         */
        public /* writeonly */ displayOptions: Record<string, any>;

        /**
         * Sets an HTML header that will be dumped once in the output stream.
         */
        public /* writeonly */ dumpHeader: string;

        /**
         * Sets an HTML prefix and suffix that will encapse every single dump.
         *
         * @param prefix The prepended HTML string
         * @param suffix The appended HTML string
         */
        setDumpBoundaries(prefix: string, suffix: string): void;

        /**
         * {@inheritdoc}
         */
        dump(data: Data, output?: number|WritableStream|string|Invokable|null|undefined, extraDisplayOptions?: Record<string, any>): void;
        dump(data: Data, output: true, extraDisplayOptions?: Record<string, any>): string;

        /**
         * Dumps the HTML header.
         */
        protected _getDumpHeader(): string;

        /**
         * @inheritDoc
         */
        enterHash(cursor: Cursor, type: number, class_: string, hasChild: boolean): void;

        /**
         * @inheritDoc
         */
        leaveHash(cursor: Cursor, type: number, class_: string, hasChild: boolean, cut: number): void;

        /**
         * @inheritDoc
         */
        protected _style(style: string, value: string, attr?: Record<string, string>): string;

        /**
         * @inheritDoc
         */
        protected _dumpLine(depth: number, endOfValue?: boolean): void;

        private _getSourceLink(file: string, line: number): string|false;
    }
}
