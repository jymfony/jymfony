const Assert = Jymfony.Component.Testing.Framework.Assert;
const CliDumper = Jymfony.Component.VarDumper.Dumper.CliDumper;
const VarCloner = Jymfony.Component.VarDumper.Cloner.VarCloner;

/**
 * @memberOf Jymfony.Component.VarDumper.Test
 */
class VarDumperTestTrait {
    __construct() {
        /**
         * @internal
         */
        this._varDumperConfig = {
            casters: [],
            flags: null,
        };
    }

    _setUpVarDumper(casters, flags = null) {
        this._varDumperConfig.casters = casters;
        this._varDumperConfig.flags = flags;
    }

    @afterEach()
    _tearDownVarDumper() {
        this._varDumperConfig.casters = [];
        this._varDumperConfig.flags = null;
    }

    /**
     * @param {*} expected
     * @param {*} data
     * @param {int} [filter = 0]
     * @param {string} [message = '']
     */
    assertDumpEquals(expected, data, filter = 0, message = '') {
        Assert.assertSame(this.prepareExpectation(expected, filter), this.getDump(data, null, filter), message);
    }

    /**
     * @param {*} expected
     * @param {*} data
     * @param {int} [filter = 0]
     * @param {string} [message = '']
     */
    assertDumpMatchesRegexp(expected, data, filter = 0, message = '') {
        expected = expected instanceof RegExp ? expected : new RegExp(this.prepareExpectation(expected, filter));
        Assert.assertMatchesRegularExpression(expected, this.getDump(data, null, filter), message);
    }

    /**
     * @param {*} expected
     * @param {*} data
     * @param {int} [filter = 0]
     * @param {string} [message = '']
     */
    assertDumpMatchesFormat(expected, data, filter = 0, message = '') {
        Assert.assertStringMatchesFormat(this.prepareExpectation(expected, filter), this.getDump(data, null, filter), message);
    }

    getDump(data, key = null, filter = 0) {
        let flags = this._varDumperConfig.flags;
        if (null === flags) {
            flags = 0;
            // Flags = process.env.DUMP_LIGHT_ARRAY ? CliDumper.DUMP_LIGHT_ARRAY : 0;
            // Flags |=  process.env.DUMP_STRING_LENGTH ? CliDumper.DUMP_STRING_LENGTH : 0;
            // Flags |=  process.env.DUMP_COMMA_SEPARATOR ? CliDumper.DUMP_COMMA_SEPARATOR : 0;
        }

        const cloner = new VarCloner();
        cloner.addCasters(this._varDumperConfig.casters);
        cloner.maxItems = -1;

        const dumper = new CliDumper(null, null, flags);
        dumper.colors = false;

        data = cloner.cloneVar(data, filter);
        if (null !== key && null === (data = data.seek(key))) {
            return null;
        }

        return __jymfony.rtrim(dumper.dump(data, true));
    }

    prepareExpectation(expected, filter) {
        if (!isString(expected)) {
            expected = this.getDump(expected, null, filter);
        }

        return __jymfony.rtrim(expected);
    }
}

export default getTrait(VarDumperTestTrait);
