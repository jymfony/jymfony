declare namespace Jymfony.Component.VarDumper.Cloner {
    /**
     * Represents a var cloner.
     * Implementors should serialize any js into a Data object.
     */
    export class ClonerInterface {
        public static readonly definition: Newable<ClonerInterface>;

        /**
         * Clones a JS variable.
         */
        cloneVar(variable: any): Data;
    }
}
