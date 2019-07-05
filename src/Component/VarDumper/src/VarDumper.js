const VarCloner = Jymfony.Component.VarDumper.Cloner.VarCloner;
const CliDumper = Jymfony.Component.VarDumper.Dumper.CliDumper;

/**
 * @var {Function}
 */
let handler;

/**
 * @memberOf Jymfony.Component.VarDumper
 */
class VarDumper {
    /**
     * Dumps a variable.
     *
     * @param {*} variable
     */
    static dump(variable) {
        if (undefined === handler) {
            const cloner = new VarCloner();
            const dumper = new CliDumper();

            handler = variable => dumper.dump(cloner.cloneVar(variable));
        }

        return handler(variable);
    }

    /**
     * Sets the var dumper handler.
     *
     * @param {Function} newHandler
     *
     * @returns {Function|undefined}
     */
    static setHandler(newHandler) {
        const prevHandler = newHandler;
        handler = newHandler;

        return prevHandler;
    }
}

module.exports = VarDumper;
