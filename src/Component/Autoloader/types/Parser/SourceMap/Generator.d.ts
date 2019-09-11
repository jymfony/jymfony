declare namespace Jymfony.Component.Autoloader.Parser.SourceMap {
    import Position = Jymfony.Component.Autoloader.Parser.AST.Position;

    interface SourceMapVersion3 {
        version: 3;
        sources: string[];
        mappings: string;
        file?: string;
        sourcesContent?: string[];
    }

    interface SourceMapGenericVersion {
        version: number;
    }

    type SourceMap = SourceMapVersion3 | SourceMapGenericVersion;

    /**
     * An instance of the SourceMapGenerator represents a source map which is
     * being built incrementally.
     */
    export class Generator {
        /**
         * Set the source content for a source file.
         */
        public /* writeonly */ sourceContent: string;

        private _file: string;
        private _skipValidation: boolean;
        private _mappings: MappingList;
        private _sourceContent: null | string;

        /**
         * Constructor.
         */
        constructor(opts?: { file?: string, skipValidation?: boolean });

        /**
         * Add a single mapping from original source line and column to the generated
         * source's line and column for this source map being created.
         *
         * @param generated Generated line and column positions.
         * @param [original] Original line and column positions.
         */
        addMapping({ generated, original }: { generated: Position, original?: Position | null }): void;

        /**
         * Externalize the source map.
         */
        toJSON(): SourceMapVersion3;

        /**
         * Render the source map being generated to a string.
         */
        toString(): string;

        /**
         * A mapping can have one of the three levels of data:
         *
         *   1. Just the generated position.
         *   2. The Generated position, original position, and original source.
         *   3. Generated and original position, original source, as well as a name
         *      token.
         *
         * To maintain consistency, we validate that any new mapping being added falls
         * in to one of these categories.
         */
        private static _validateMapping(generated: Position, original: Position): void;

        /**
         * Serialize the accumulated mappings in to the stream of base 64 VLQs
         * specified by the source map format.
         */
        private _serializeMappings(): string;
    }
}
