declare namespace Jymfony.Component.Testing {
    export class ExporterTrait {
        private _exporter: (other: any) => string;

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * Exports a value into a string
         */
        export(value: any): string;

        /**
         * Exports a value into a single-line string
         *
         * The output of this method is similar to the output of export().
         *
         * Newlines are replaced by the visible string '\n'.
         * Contents of arrays and objects (if any) are replaced by '...'.
         */
        shortenedExport(value: any): string;
    }
}
