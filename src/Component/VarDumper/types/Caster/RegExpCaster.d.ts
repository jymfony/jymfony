declare namespace Jymfony.Component.VarDumper.Caster {
    import Stub = Jymfony.Component.VarDumper.Cloner.Stub;

    export class RegExpCaster {
        /**
         * Casts a RegExp object.
         */
        static castRegExp(regexp: RegExp, a: any, stub: Stub): any;
    }
}
