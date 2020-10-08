let chai;
try {
    chai = require('chai');
} catch (e) {
    chai = { };
}

const VarCloner = Jymfony.Component.VarDumper.Cloner.VarCloner;
const CliDumper = Jymfony.Component.VarDumper.Dumper.CliDumper;
const { Assertion, util } = chai;
const path = require('path');

let cloner = null;
let dumper = null;

const getDump = (data, key = undefined, filter = 0) => {
    if (null === cloner) {
        cloner = new VarCloner();
        cloner.maxItems = -1;
    }

    if (null === dumper) {
        dumper = new CliDumper();
        dumper.colors = false;
    }

    data = cloner.cloneVar(data, filter);
    if (undefined !== key && null === (data = data.seek(key))) {
        return null;
    }

    return __jymfony.trim(dumper.dump(data, true));
};

const prepareExpectation = (expected, filter = 0) => {
    if (! isString(expected)) {
        expected = getDump(expected, undefined, filter);
    }

    return __jymfony.trim(expected);
};

if (!! util) {
    function dump(val, message = undefined) {
        if (message) {
            util.flag(this, 'message', message);
        }

        const obj = getDump(util.flag(this, 'object'));
        val = prepareExpectation(val);

        if (util.flag(this, '__jymfony.dump_format')) {
            val = __jymfony.strtr(__jymfony.regex_quote(val), {
                '/': '\\/',
                '%%': '%',
                '%e': '\\' + path.sep,
                '%s': '[^\\r\\n]+',
                '%S': '[^\\r\\n]*',
                '%a': '.+',
                '%A': '.*',
                '%w': '\\s*',
                '%i': '[+-]?\\d+',
                '%d': '\\d+',
                '%x': '[0-9a-fA-F]+',
                '%f': '[+-]?\\.?\\d+\\.?\\d*(?:[Ee][+-]?\\d+)?',
                '%c': '.',
            });

            this.assert(
                (new RegExp('^' + val + '$', 's')).test(getDump(this._obj)),
                'expected #{this} dumps matching format #{exp}',
                'expected #{this} does not dump matching format #{exp}',
                val,
                obj,
                true
            );
        } else {
            this.assert(
                prepareExpectation(val) === obj,
                'expected #{this} dumps the same as #{exp}',
                'expected #{this} does not dump the same as #{exp}',
                val,
                obj,
                true
            );
        }
    }

    util.addChainableMethod(Assertion.prototype, 'dump', dump, function () {
        util.flag(this, '__jymfony.dump', true);
    });

    util.addChainableMethod(Assertion.prototype, 'as', dump);
    util.addChainableMethod(Assertion.prototype, 'format', function (val, message = undefined) {
        util.flag(this, '__jymfony.dump_format', true);
        dump.apply(this, [ val, message ]);
    }, function () {
        util.flag(this, '__jymfony.dump_format', true);
    });
}
