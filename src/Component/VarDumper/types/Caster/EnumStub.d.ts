declare namespace Jymfony.Component.VarDumper.Caster {
    import Stub = Jymfony.Component.VarDumper.Cloner.Stub;

    /**
     * Represents an enumeration of values.
     *
     * @memberOf Jymfony.Component.VarDumper.Caster
     */
    export class EnumStub extends Stub {
        public dumpKeys: boolean;

        /**
         * Constructor
         */
        // @ts-ignore
        __construct(values: Record<any, any>, dumpKeys?: boolean): void;
        constructor(values: Record<any, any>, dumpKeys?: boolean);
    }
}
