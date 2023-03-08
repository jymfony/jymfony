/**
 * @memberOf Jymfony.Component.Console.Helper
 * @final
 */
export default class Dumper {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Console.Output.OutputInterface} output
     * @param {Jymfony.Component.VarDumper.Dumper.CliDumper} [dumper = null]
     * @param {Jymfony.Component.VarDumper.Cloner.ClonerInterface} [cloner = null]
     */
    __construct(output, dumper = null, cloner = null) {
        this._output = output;
        this._dumper = dumper;
        this._cloner = cloner;

        if (ReflectionClass.exists('Jymfony.Component.VarDumper.Dumper.CliDumper')) {
            this._handler = variable => {
                const dumper = (this._dumper = this._dumper || new Jymfony.Component.VarDumper.Dumper.CliDumper(null, null));
                dumper.colors = this._output.decorated;

                return __jymfony.rtrim(dumper.dump((this._cloner = this._cloner || new Jymfony.Component.VarDumper.Cloner.VarCloner()).cloneVar(variable), true));
            };
        } else {
            this._handler = JSON.stringify;
        }
    }

    __invoke(variable) {
        return this._handler(variable);
    }
}
