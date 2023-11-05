import { realpathSync } from 'fs';

const Autoloader = Jymfony.Component.Autoloader.Autoloader;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class AutoloaderTest extends TestCase {
    get testCaseName() {
        return '[Autoloader] ' + super.testCaseName;
    }

    testAutoloaderShouldBeASingleton() {
        const glob = {};
        const autoloader = new Autoloader({
            findRoot() {
                return realpathSync(__dirname + '/..');
            },
        }, glob);

        __self.assertEquals(autoloader, new Autoloader({}, glob));
        __self.assertEquals(autoloader, glob.__jymfony.autoload);
    }

    testJObjectShouldCall__construct() {
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

        const cl = class TestClass {
            __construct() {
                called = true;
            }
        };

        new cl();
        __self.assertTrue(called);
    }

    testJObjectShouldCall__invokeWhenNeeded() {
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

        const cl = class TestClass {
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

        __self.assertInstanceOf(cl, obj);

        __self.assertTrue(ConstructCalled);
        __self.assertEquals([ 'foo', 'bar' ], InvokeCalled);
        __self.assertTrue(MethodCalled);
    }
}
