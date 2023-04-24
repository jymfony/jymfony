declare namespace Jymfony.Component.Console.Helper {
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    /**
     * @final
     */
    export class Dumper {
        private _output: OutputInterface;
        private _dumper: any;
        private _cloner: any;
        private _handler: (variable: any) => string;

        /**
         * Constructor.
         *
         * @param output
         * @param {Jymfony.Component.VarDumper.Dumper.CliDumper} [dumper = null]
         * @param {Jymfony.Component.VarDumper.Cloner.ClonerInterface} [cloner = null]
         */
        __construct(output: OutputInterface, dumper?: any, cloner?: any): void;
        constructor(output: OutputInterface, dumper?: any, cloner?: any);

        __invoke(variable): string;
    }
}
