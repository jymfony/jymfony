const DumperInterface = Jymfony.Component.VarDumper.Cloner.DumperInterface;
const DataDumperInterface = Jymfony.Component.VarDumper.Dumper.DataDumperInterface;
const fs = require('fs');

/**
 * Abstract mechanism for dumping a Data object.
 *
 * @memberOf Jymfony.Component.VarDumper.Dumper
 * @abstract
 */
class AbstractDumper extends implementationOf(DumperInterface, DataDumperInterface) {
    /**
     * Constructor.
     *
     * @param {number|Stream|string|Function} output
     * @param {int} flags
     */
    __construct(output = undefined, flags = 0) {
        this._flags = flags;
        this._outputStream = undefined;
        this._lineDumper = undefined;
        this._indentPad = '  ';
        this._line = '';
        this.setOutput(output || process.stdout);
    }

    /**
     * Sets the output destination of the dumps.
     *
     * @param {number|Stream|string|Function} output
     *
     * @returns {number}
     */
    setOutput(output) {
        const prev = undefined !== this._outputStream ? this._outputStream : this._lineDumper;

        if (isFunction(output)) {
            this._outputStream = undefined;
            this._lineDumper = output;
        } else {
            if (isString(output)) {
                output = fs.openSync(output, 'wb');
            }

            this._outputStream = output;
            this._lineDumper = this._echoLine.bind(this);
        }

        return prev;
    }

    /**
     * Sets the indentation pad string.
     *
     * @param {string} pad A string that will be prepended to dumped lines, repeated by nesting level
     *
     * @returns {string} The previous indent pad
     */
    setIndentPad(pad) {
        const prev = this._indentPad;
        this._indentPad = pad;

        return prev;
    }

    /**
     * Dumps a Data object.
     *
     * @param {Jymfony.Component.VarDumper.Cloner.Data} data A Data object
     * @param {number|Stream|string|Function|null|boolean} output A line dumper callable, an opened stream, an output path or true to return the dump
     *
     * @returns {string|null} The dump as string when output is true
     */
    dump(data, output = null) {
        const returnDump = true === output;
        let prevOutput;
        if (returnDump) {
            output = new __jymfony.StreamBuffer();
        }

        if (output) {
            prevOutput = this.setOutput(output);
        }

        try {
            data.dump(this);
            this._dumpLine(-1);

            if (returnDump) {
                return output.buffer.toString();
            }
        } finally {
            if (output) {
                this.setOutput(prevOutput);
            }
        }
    }
    /**
     * Dumps the current line.
     *
     * @param {int} depth The recursive depth in the dumped structure for the line being dumped,
     *                    or -1 to signal the end-of-dump to the line dumper callable
     *
     * @protected
     */
    _dumpLine(depth) {
        (this._lineDumper)(this._line, depth, this._indentPad);
        this._line = '';
    }

    /**
     * Generic line dumper callback.
     *
     * @param {string} line The line to write
     * @param {int} depth The recursive depth in the dumped structure
     * @param {string} indentPad The line indent pad
     *
     * @private
     */
    _echoLine(line, depth, indentPad) {
        if (-1 !== depth) {
            if (this._outputStream && this._outputStream.fd) {
                fs.writeSync(this._outputStream.fd, indentPad.repeat(depth) + line + '\n');
            } else if (isNumber(this._outputStream)) {
                fs.writeSync(this._outputStream, indentPad.repeat(depth) + line + '\n');
            } else if (isStream(this._outputStream)) {
                this._outputStream.write(indentPad.repeat(depth) + line + '\n');
            }
        }
    }
}

module.exports = AbstractDumper;
