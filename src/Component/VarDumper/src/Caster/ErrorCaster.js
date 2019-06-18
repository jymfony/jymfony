const Caster = Jymfony.Component.VarDumper.Caster.Caster;
const FrameStub = Jymfony.Component.VarDumper.Caster.FrameStub;
const TraceStub = Jymfony.Component.VarDumper.Caster.TraceStub;
const Stub = Jymfony.Component.VarDumper.Cloner.Stub;

/**
 * @memberOf Jymfony.Component.VarDumper.Caster
 */
class ErrorCaster {
    /**
     * Casts an Error object.
     *
     * @param {Error} error
     * @param {Object} a
     * @param {Jymfony.Component.VarDumper.Cloner.Stub} stub
     * @param {boolean} isNested
     * @param {int} filter
     *
     * @returns {Object}
     */
    static castError(error, a, stub, isNested, filter) {
        const trace = error.stackTrace || Exception.parseStackTrace(error);

        return __self._filterExceptionArray(trace, {
            [Caster.PREFIX_VIRTUAL + 'message']: error.message,
            [Caster.PREFIX_VIRTUAL + 'code']: error.code,
            [Caster.PREFIX_VIRTUAL + 'previous']: error.previous,
        }, filter);
    }

    /**
     *
     * @param {Jymfony.Component.VarDumper.Caster.TraceStub} trace
     * @param {Object} a
     * @param {Jymfony.Component.VarDumper.Cloner.Stub} stub
     * @param {boolean} isNested
     *
     * @returns {*}
     */
    static castTraceStub(trace, a, stub, isNested) {
        if (! isNested) {
            return a;
        }

        stub.class_ = '';
        stub.handle = 0;
        stub.type = Stub.TYPE_ARRAY;

        const frames = trace.value;
        let i = trace.sliceOffset;
        let j = frames.length;

        a = [];
        if (0 > i) {
            i = Math.max(0, i + j);
        }

        if (! trace.value[i]) {
            return [];
        }

        for (j += trace.numberingOffset - i++; undefined !== frames[i]; ++i, --j) {
            a.push(new FrameStub(frames[i]));
        }

        return a;
    }

    /**
     * @param {Jymfony.Component.VarDumper.Caster.FrameStub} frame
     *
     * @returns {*}
     */
    static castFrameStub(frame) {
        const value = frame.value;

        return {
            [Caster.PREFIX_VIRTUAL + 'file']: value.file,
            [Caster.PREFIX_VIRTUAL + 'line']: value.line,
            [Caster.PREFIX_VIRTUAL + 'function']: value.function,
        };
    }

    static _filterExceptionArray(trace, a, filter) {
        if (! (filter & Caster.EXCLUDE_VIRTUAL) && 0 < __jymfony.keys(trace).length) {
            a[Caster.PREFIX_VIRTUAL + 'trace'] = new TraceStub(trace);
        }

        return a;
    }
}

module.exports = ErrorCaster;
