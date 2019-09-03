declare namespace Jymfony.Component.Autoloader.Parser.SourceMap {
    import Position = Jymfony.Component.Autoloader.Parser.AST.Position;

    export class Mapping {
        public generatedLine: number;
        public generatedColumn: number;
        public originalLine: number|false;
        public originalColumn: number|false;
        public source: string|null;
        public name: string|null;

        /**
         * Constructor.
         */
        constructor(generated: Position, original?: Position|null, source?: string|null, name?: string|null);

        /**
         * Comparator between two mappings with inflated source and name strings where
         * the generated positions are compared.
         *
         * @param {Jymfony.Component.Autoloader.Parser.SourceMap.Mapping} other
         */
        compareByGeneratedPositionsInflated(other: Mapping): number;

        /**
         * Comparator between two mappings with deflated source and name indices where
         * the generated positions are compared.
         */
        static compareByGeneratedPositionsDeflated(this_: Mapping, other: Mapping): number;
    }
}
