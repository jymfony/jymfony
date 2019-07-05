declare namespace Jymfony.Component.VarDumper.Dumper {
    import DumperInterface = Jymfony.Component.VarDumper.Cloner.DumperInterface;
    import WritableStream = NodeJS.WritableStream;
    import Data = Jymfony.Component.VarDumper.Cloner.Data;

    /**
     * Abstract mechanism for dumping a Data object.
     */
    export abstract class AbstractDumper extends implementationOf(DumperInterface, DataDumperInterface) {
        private _flags: number;
        private _lineDumper: Invokable;
        protected _outputStream: number|WritableStream|undefined;
        protected _indentPad: string;
        protected _line: string;

        /**
         * Constructor.
         */
        __construct(output?: number|WritableStream|string|Invokable, flags?: number): void;
        constructor(output?: number|WritableStream|string|Invokable, flags?: number);

        /**
         * Sets the output destination of the dumps.
         */
        setOutput(output: number|WritableStream|string|Invokable): number|WritableStream|string|Invokable;

        /**
         * Sets the indentation pad string.
         *
         * @param pad A string that will be prepended to dumped lines, repeated by nesting level
         *
         * @returns The previous indent pad
         */
        setIndentPad(pad: string): string;

        /**
         * Dumps a Data object.
         *
         * @param data A Data object
         * @param output A line dumper callable, an opened stream, an output path or true to return the dump
         *
         * @returns The dump as string when output is true
         */
        dump(data: Data, output?: number|WritableStream|string|Invokable|null|undefined): void;
        dump(data: Data, output: true): string;

        /**
         * Dumps the current line.
         *
         * @param depth The recursive depth in the dumped structure for the line being dumped,
         *              or -1 to signal the end-of-dump to the line dumper callable
         */
        protected _dumpLine(depth: number): void;

        /**
         * Generic line dumper callback.
         *
         * @param line The line to write
         * @param depth The recursive depth in the dumped structure
         * @param indentPad The line indent pad
         */
        private _echoLine(line: string, depth: number, indentPad: string): void
    }
}
