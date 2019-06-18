declare namespace Jymfony.Component.VarDumper.Dumper {
    import Data = Jymfony.Component.VarDumper.Cloner.Data;

    /**
     * DataDumperInterface for dumping Data objects.
     */
    export class DataDumperInterface {
        public static readonly definition: Newable<DataDumperInterface>;

        /**
         * Dumps data object.
         */
        dump(data: Data);
    }
}
