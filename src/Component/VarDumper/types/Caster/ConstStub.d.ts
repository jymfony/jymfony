declare namespace Jymfony.Component.VarDumper.Caster {
    import Stub = Jymfony.Component.VarDumper.Cloner.Stub;

    /**
     * Represents a constant and its value.
     */
    export class ConstStub extends Stub {
        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(name: string, value?: any): void;
        constructor(name: string, value?: any);

        toString(): string;
    }
}
