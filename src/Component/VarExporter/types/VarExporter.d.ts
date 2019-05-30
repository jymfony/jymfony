declare namespace Jymfony.Component.VarExporter {
    /**
     * Exports serializable JS values to JS code.
     */
    export class VarExporter {
        /**
         * Exports a serializable JS value to JS code.
         */
        static export(value: any): string;
    }
}
