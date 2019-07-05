declare namespace Jymfony.Component.VarDumper.Caster {
    import Stub = Jymfony.Component.VarDumper.Cloner.Stub;

    export class BufferCaster {
        /**
         * Casts a Buffer object.
         */
        static castBuffer(buffer: Buffer, a: any, stub: Stub): any;
    }
}
