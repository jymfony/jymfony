declare namespace Jymfony.Component.VarDumper {
    export class VarDumper {
        /**
         * Dumps a variable.
         */
        static dump(variable: any): any;

        /**
         * Sets the var dumper handler.
         */
        static setHandler(newHandler: Invokable): Invokable|undefined;
    }
}
