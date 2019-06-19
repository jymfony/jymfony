declare namespace Jymfony.Component.VarDumper.Caster {
    import Stub = Jymfony.Component.VarDumper.Cloner.Stub;
    import ThrowingCasterException = Jymfony.Component.VarDumper.Exception.ThrowingCasterException;

    export class ErrorCaster {
        /**
         * Casts an Error object.
         */
        static castError(error: Error, a: any, stub: Stub, isNested: boolean, filter: number): any;

        static castThrowingCasterException(e: ThrowingCasterException, a: any): any;

        static castTraceStub(trace: TraceStub, a: any, stub: Stub, isNested: boolean): any;

        static castFrameStub(frame: FrameStub, a: any, stub: Stub, isNested: boolean): any;

        private static _filterExceptionArray(trace: Record<string, string>[], a: any, filter: number);

        private static _extractSource(srcLines: string, line: number, title: string, lang: string, file?: string);
    }
}
