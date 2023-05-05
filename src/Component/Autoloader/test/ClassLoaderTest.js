import { join } from 'path';

const ClassLoader = Jymfony.Component.Autoloader.ClassLoader;
const Finder = Jymfony.Component.Autoloader.Finder;
const Namespace = Jymfony.Component.Autoloader.Namespace;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

const fixturesDir = join(__dirname, '..', 'fixtures');

export default class ClassLoaderTest extends TestCase {
    /**
     * @type {Jymfony.Component.Autoloader.ClassLoader}
     */
    _classLoader;

    get testCaseName() {
        return '[Autoloader] ' + super.testCaseName;
    }

    beforeEach() {
        this._classLoader = new ClassLoader(new Finder(), require('path'), require('vm'));
    }

    afterEach() {
        delete global.Foo;
    }

    testShouldResolvePathsOnRequireCalls() {
        const exports = this._classLoader.loadFile(__dirname + '/../fixtures/ClassLoader/module_with_subdirectory/subdir/fixture.js', undefined, {});
        __self.assertEquals('This is a test: TESTTEST WOW', exports);
    }

    testShouldResolveCircularReferences() {
        const exports = this._classLoader.loadFile(__dirname + '/../fixtures/ClassLoader/circular/index.js', undefined, {});
        __self.assertInstanceOf(Function, exports.first);
        __self.assertInstanceOf(Function, exports.second);
        __self.assertEquals(exports.first, Object.getPrototypeOf(exports.second));

        const f = new exports.first();
        const s = new exports.second();

        __self.assertInstanceOf(exports.second, s);
        __self.assertInstanceOf(f.getSecond(), s);
        __self.assertInstanceOf(exports.second, new (f.getSecond())());
    }

    testShouldTranspileTypescriptFiles() {
        global.Foo = new Namespace(__jymfony.autoload, 'Foo', fixturesDir, require);
        const FooBar = Foo.ts.FooBar;

        const inst = new FooBar('value');
        __self.assertEquals('value', inst._aNode);

        const Bar = Foo.ts.Bar;
        const barInstance = new Bar();

        __self.assertInstanceOf(FooBar, barInstance._foo);
    }
}
