const JsMatcherDumper = Jymfony.Component.Routing.Dumper.JsMatcherDumper;
const MatcherTest = require('./MatcherTest').MatcherTest;

const vm = require('vm');

describe('[Routing] DumpedMatcherTest', function () {
    MatcherTest.call(this);

    this._getMatcher = (routes) => {
        const dumper = new JsMatcherDumper(routes);
        const code = `(function(exports, require, module, __filename, __dirname, __self) { ${dumper.dump()} });`;

        const moduleObj = {
            children: [],
            exports: undefined,
            filename: __filename,
            id: __filename,
            loaded: false,
            parent: module,
            paths: __dirname,
            require: require,
        };

        vm.runInThisContext(code, {
            produceCachedData: false,
        })(moduleObj.exports, (id) => {
            if (id.startsWith('./') || id.startsWith('../')) {
                return require(this._path.resolve(__dirname, id));
            }

            return require(id);
        }, moduleObj, __filename, __dirname, undefined);

        return new moduleObj.exports();
    };
});
