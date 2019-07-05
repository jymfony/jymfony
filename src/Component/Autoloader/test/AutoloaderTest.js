const expect = require('chai').expect;
const fs = require('fs');

/*
 * We are testing autoloader component here
 * cannot use the autoloader itself to load classes! :)
 */
const Autoloader = require('../src/Autoloader');

describe('[Autoloader] Autoloader', () => {
    it('autoloader should be a singleton', () => {
        const glob = {};
        const autoloader = new Autoloader({
            findRoot() {
                return fs.realpathSync(__dirname + '/..');
            },
        }, glob);

        expect(new Autoloader({}, glob)).to.be.equal(autoloader);
        expect(glob.__jymfony.autoload).to.be.equal(autoloader);
    });

    it('JObject should call __construct', () => {
        const glob = {
            Symbol: {},
        };
        const autoloader = new Autoloader({
            findRoot: () => {
                return __dirname + '/..';
            },
            listModules: () => [],
        }, glob);
        autoloader.register();

        let called = false;

        const cl = class TestClass extends glob.__jymfony.JObject {
            __construct() {
                called = true;
            }
        };

        new cl();
        expect(called).to.be.true;
    });

    it('JObject should call __invoke when needed', () => {
        const glob = {
            Symbol: {},
        };
        const autoloader = new Autoloader({
            findRoot: () => {
                return __dirname + '/..';
            },
            listModules: () => [],
        }, glob);
        autoloader.register();

        let ConstructCalled = false;
        let InvokeCalled = false;
        let MethodCalled = false;

        const cl = class TestClass extends glob.__jymfony.JObject {
            __construct() {
                ConstructCalled = true;
            }

            __invoke(arg1, arg2) {
                InvokeCalled = [ arg1, arg2 ];
            }

            method() {
                MethodCalled = true;
            }
        };

        const obj = new cl();
        obj('foo', 'bar');
        obj.method();

        expect(obj instanceof cl).to.be.true;

        expect(ConstructCalled).to.be.true;
        expect(InvokeCalled).to.be.deep.equal([ 'foo', 'bar' ]);
        expect(MethodCalled).to.be.true;
    });
});
