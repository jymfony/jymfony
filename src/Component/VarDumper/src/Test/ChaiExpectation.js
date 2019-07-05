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

const getDump = (data, key = undefined, filter = 0) => {
    const cloner = new VarCloner();
    cloner.maxItems = -1;

    const dumper = new CliDumper();
    dumper.colors = false;

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
    util.addChainableMethod(Assertion.prototype, 'dumpsAs', function (val, message = undefined) {
        if (message) {
            util.flag(this, 'message', message);
        }

        const obj = getDump(util.flag(this, 'object'));
        val = prepareExpectation(val);

        this.assert(
            prepareExpectation(val) === obj
            , 'expected #{this} dumps the same as #{exp}'
            , 'expected #{this} does not dump the same as #{exp}'
            , val
            , obj
            , true
        );
    });

    util.addChainableMethod(Assertion.prototype, 'dumpsAsFormat', function (str, message = undefined) {
        str = prepareExpectation(str);
        str = __jymfony.strtr(__jymfony.regex_quote(str), {
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

        new Assertion(getDump(this._obj)).to.match(new RegExp('^' + str + '$', 's'), message);
    });
}
