const CliDumper = Jymfony.Component.VarDumper.Dumper.CliDumper;
const VarCloner = Jymfony.Component.VarDumper.Cloner.VarCloner;

/**
 * @memberOf Jymfony.Component.Testing
 */
class ExporterTrait {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {function(other: any): string}
         *
         * @private
         */
        this._exporter = undefined;
    }

    /**
     * Exports a value into a string
     *
     * @param {*} value
     *
     * @returns {string}
     */
    export(value) {
        if (undefined === this._exporter) {
            const cloner = new VarCloner();
            const dumper = new CliDumper();
            dumper.colors = false;

            this._exporter = variable =>
                __jymfony.trim(dumper.dump(cloner.cloneVar(variable), true).toString());
        }

        return this._exporter(value);
    }

    /**
     * Exports a value into a single-line string
     *
     * The output of this method is similar to the output of export().
     *
     * Newlines are replaced by the visible string '\n'.
     * Contents of arrays and objects (if any) are replaced by '...'.
     *
     * @param {*} value
     *
     * @returns {string}
     */
    shortenedExport(value) {
        if (isString(value)) {
            let string = this.export(value).replace(/\n/g, '');
            if (40 < string.length) {
                string = string.substr(0, 30) + '...' + string.substr(string.length - 7);
            }

            return string;
        }

        if (isArray(value) || isObjectLiteral(value)) {
            return __jymfony.sprintf(
                '%s (%s)',
                isArray(value) ? 'Array' : 'Object',
                0 < Object.keys(value).length ? '...' : ''
            );
        }

        if (isObject(value)) {
            return __jymfony.sprintf(
                '%s Object (%s)',
                ReflectionClass.getClassName(value),
                0 < Object.keys(value).length ? '...' : ''
            );
        }

        return this.export(value);
    }
}

export default getTrait(ExporterTrait);
