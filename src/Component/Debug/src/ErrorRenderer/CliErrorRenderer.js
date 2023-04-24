const CliDumper = Jymfony.Component.VarDumper.Dumper.CliDumper;
const ErrorRendererInterface = Jymfony.Contracts.Debug.ErrorRenderer.ErrorRendererInterface;
const FlattenException = Jymfony.Component.Debug.Exception.FlattenException;
const VarCloner = Jymfony.Component.VarDumper.Cloner.VarCloner;

/**
 * @memberOf Jymfony.Component.Debug.ErrorRenderer
 */
export default class CliErrorRenderer extends implementationOf(ErrorRendererInterface) {
    /**
     * @inheritdoc
     */
    render(exception) {
        const cloner = new VarCloner();
        const dumper = new class extends CliDumper {
            _supportsColors() {
                const outputStream = this._outputStream;
                this._outputStream = process.stdout;

                try {
                    return super._supportsColors();
                } finally {
                    this._outputStream = outputStream;
                }
            }
        }();

        const ex = FlattenException.create(exception);
        ex.asString = dumper.dump(cloner.cloneVar(exception), true);

        return ex;
    }
}
