declare namespace Jymfony.Component.VarDumper.Cloner {
    /**
     * Represents the current state of a dumper while dumping.
     */
    export class Cursor {
        private depth: number;
        private refIndex: number;
        private softRefTo: number;
        private softRefCount: number;
        private hashType: number;
        private hashKey: any;
        private hashIndex: number;
        private hashLength: number;
        private hashCut: number;
        private stop: boolean;
        private attr: any;
        private skipChildren: boolean;

        constructor();
    }
}
