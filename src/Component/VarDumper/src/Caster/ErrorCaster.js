const Caster = Jymfony.Component.VarDumper.Caster.Caster;
const ConstStub = Jymfony.Component.VarDumper.Caster.ConstStub;
const EnumStub = Jymfony.Component.VarDumper.Caster.EnumStub;
const FrameStub = Jymfony.Component.VarDumper.Caster.FrameStub;
const LinkStub = Jymfony.Component.VarDumper.Caster.LinkStub;
const TraceStub = Jymfony.Component.VarDumper.Caster.TraceStub;
const Stub = Jymfony.Component.VarDumper.Cloner.Stub;

const fs = require('fs');
const $framesCache = {};

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

    static castThrowingCasterException(e, a) {
        const trace = Caster.PREFIX_VIRTUAL + 'trace';
        const xPrefix = "\0~\0";

        if (!! a[xPrefix + 'previous'] && !! a[trace] && a[xPrefix + 'previous'] instanceof Error) {
            const prev = a[xPrefix + 'previous'];
            a[trace] = new TraceStub(prev.stackTrace || Exception.parseStackTrace(prev), 0, a[trace].value.length);
        }

        delete a[xPrefix + 'previous'];
        delete a[xPrefix + 'code'];
        delete a[xPrefix + 'file'];
        delete a[xPrefix + 'line'];

        return a;
    }

    /**
     * Casts a TraceStub object.
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
        stub.type = Stub.TYPE_OBJECT;

        const prefix = Caster.PREFIX_VIRTUAL;
        const frames = trace.value;
        let i = trace.sliceOffset;
        let j = frames.length;

        a = {};
        if (0 > i) {
            i = Math.max(0, i + j);
        }

        if (! trace.value[i]) {
            return {};
        }

        let collapse = false;
        for (j += trace.numberingOffset - i; undefined !== frames[i]; ++i, --j) {
            let f = frames[i];
            let label;

            const call = f.function || '???';

            let frame = new FrameStub(frames[i]);
            f = __self.castFrameStub(frame, {}, frame, true);
            if (!! f && !! f[prefix + 'src']) {
                for ([ label, frame ] of __jymfony.getEntries(f[prefix + 'src'].value)) {
                    if (label.startsWith('\0~collapse=0')) {
                        if (collapse) {
                            label = label.substr(0, 11) + '1' + label.substr(12);
                        } else {
                            collapse = true;
                        }
                    }

                    label = '\0~title=Stack level ' + j + '.&' + label.substr(2);
                }

                f = frames[i - 1];
            } else {
                label = '\0~title=Stack level ' + j + '.\0' + call;
            }

            label = '\0~' + __jymfony.sprintf('separator=%s&', frame instanceof EnumStub ? ' ' : ':') + label.substr(2);
            a[label] = frame;
        }

        if (undefined !== trace.sliceLength) {
            a = __jymfony.keys(a)
                .slice(0, trace.sliceLength)
                .reduce((res, cur) => (res[cur] = a[cur], res), {});
        }

        return a;
    }

    /**
     * @param {Jymfony.Component.VarDumper.Caster.FrameStub} frame
     * @param {Object} a
     * @param {Jymfony.Component.VarDumper.Cloner.Stub} stub
     * @param {boolean} isNested
     *
     * @returns {*}
     */
    static castFrameStub(frame, a, stub, isNested) {
        if (! isNested) {
            return a;
        }

        const f = frame.value;
        const prefix = Caster.PREFIX_VIRTUAL;

        if (f.file && f.line) {
            const cacheKey = [ ...Object.values(f).map(v => String(v)) ].join('-');
            if ($framesCache[cacheKey]) {
                a[prefix + 'src'] = $framesCache[cacheKey];
            } else {
                // TODO: filter eval

                const caller = __jymfony.sprintf('in %s() on line %d', f.function, f.line);
                let src = f.line;
                let srcKey = f.file;
                let ellipsis = new LinkStub(srcKey, 0);
                let srcAttr;
                const ellipsisTail = ~~ellipsis.attr['ellipsis-tail'];
                ellipsis = ~~ellipsis.attr['ellipsis'];

                if (fs.existsSync(f.file)) {
                    if (srcKey === f.file) {
                        src = __self._extractSource(fs.readFileSync(srcKey, { encoding: 'utf-8' }), f.line, caller, 'js', f.file);
                        srcKey += ':' + f.line;
                        if (ellipsis) {
                            ellipsis += 1 + f.line.length;
                        }
                    }

                    srcAttr = __jymfony.sprintf('collapse=%d&separator= &file=%s&line=%d', ellipsis.inNodeModules ? 1 : 0, encodeURIComponent(f.file), f.line);
                } else {
                    srcAttr = 'separator=:';
                }

                srcAttr += ellipsis ? '&ellipsis-type=path&ellipsis=' + ellipsis + '&ellipsis-tail=' + ellipsisTail : '';
                $framesCache[cacheKey] = a[prefix+'src'] = new EnumStub({['\0~' + srcAttr + '\0' + srcKey]: src});
            }
        }

        if (frame.inTraceStub) {
            delete a[prefix + 'function'];
        }

        return Object.filter(a, v => !! v);
    }

    static _filterExceptionArray(trace, a, filter) {
        if (! (filter & Caster.EXCLUDE_VIRTUAL) && 0 < __jymfony.keys(trace).length) {
            a[Caster.PREFIX_VIRTUAL + 'trace'] = new TraceStub(trace);
        }

        if (! a[Caster.PREFIX_VIRTUAL + 'previous']) {
            delete a[Caster.PREFIX_VIRTUAL + 'previous'];
        }

        return a;
    }

    static _extractSource(srcLines, line, title, lang, file = undefined) {
        srcLines = srcLines.split('\n');
        const src = [];

        for (let i = line - 3; i <= line + 1; ++i) {
            src.push((srcLines[i] ? srcLines[i] : '') + '\n');
        }

        srcLines = {};
        let ltrim = 0;
        let i, c;
        let pad = null;

        do {
            pad = null;
            for (i = 1 << 1; 0 <= i; --i) {
                c = src[i][ltrim];
                if (src[i][ltrim] && '\r' !== c && '\n' !== c) {
                    if (null === pad) {
                        pad = c;
                    }

                    if ((' ' !== c && '\t' !== c) || pad !== c) {
                        break;
                    }
                }
            }
            ++ltrim;
        } while (0 > i && null !== pad);

        --ltrim;

        for ([ i, c ] of __jymfony.getEntries(src)) {
            if (ltrim) {
                c = c[ltrim] && '\r' !== c[ltrim] ? c.substr(ltrim) : __jymfony.ltrim(c, ' \t');
            }

            c = c.substr(0, c.length - 1);
            if (2 !== i) {
                c = new ConstStub('default', c);
            } else {
                c = new ConstStub(c, title);
                if (undefined !== file) {
                    c.attr.file = file;
                    c.attr.line = line;
                }
            }

            c.attr.lang = lang;
            srcLines[__jymfony.sprintf('\0~separator=› &%d\0', i + line - 1)] = c;
        }

        return new EnumStub(srcLines);
    }
}

module.exports = ErrorCaster;
