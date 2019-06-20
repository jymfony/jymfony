declare namespace Jymfony.Component.VarDumper.Caster {
    import Stub = Jymfony.Component.VarDumper.Cloner.Stub;

    export class StubCaster {
        static castStub(c: Stub, a: any, stub: Stub, isNested: boolean): any;
        static castEnum(c: Stub, a: any, stub: Stub, isNested: boolean): any;
        static cutInternals(obj: any, a: any, stub: Stub, isNested: boolean): any;
    }
}
