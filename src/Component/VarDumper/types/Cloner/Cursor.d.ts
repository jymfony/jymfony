declare namespace Jymfony.Component.VarDumper.Cloner {
    /**
     * Represents the current state of a dumper while dumping.
     */
    export class Cursor {
        public depth: number;
        public refIndex: number;
        public softRefTo: number;
        public softRefCount: number;
        public hashType: number;
        public hashKey: any;
        public hashIndex: number;
        public hashLength: number;
        public hashCut: number;
        public stop: boolean;
        public attr: any;
        public skipChildren: boolean;

        constructor();
    }
}
