const { expect } = require('chai');
const { join } = require('path');

/*
 * We are testing autoloader component here
 * cannot use the autoloader itself to load classes! :)
 */
const ClassLoader = require('../src/ClassLoader');
const Finder = require('../src/Finder');
const Namespace = require('../src/Namespace');
const fixturesDir = join(__dirname, '..', 'fixtures');

describe('[Autoloader] ClassLoader', function () {
    this.timeout(30000);
    beforeEach(() => {
        this._classLoader = new ClassLoader(new Finder(), require('path'), require('vm'));
    });

    it ('should resolve paths on require calls', () => {
        const exports = this._classLoader.loadFile(__dirname + '/../fixtures/ClassLoader/module_with_subdirectory/subdir/fixture.js', undefined, {});
        expect(exports).to.be.eq('This is a test: TESTTEST WOW');
    });

    it ('should resolve circular references', () => {
        const exports = this._classLoader.loadFile(__dirname + '/../fixtures/ClassLoader/circular/index.js', undefined, {});
        expect(exports.first).to.be.an.instanceOf(Function);
        expect(exports.second).to.be.an.instanceOf(Function);
        expect(Object.getPrototypeOf(exports.second)).to.be.equal(exports.first);

        const f = new exports.first();
        const s = new exports.second();

        expect(s).to.be.an.instanceOf(exports.second);
        expect(s).to.be.an.instanceOf(f.getSecond());
        expect(new (f.getSecond())()).to.be.an.instanceOf(exports.second);
    });

    it ('should transpile typescript files', () => {
        global.Foo = new Namespace(__jymfony.autoload, 'Foo', fixturesDir, require);
        const FooBar = Foo.ts.FooBar;

        const inst = new FooBar('value');
        expect(inst._aNode).to.be.equal('value');

        const Bar = Foo.ts.Bar;
        const barInstance = new Bar();

        expect(barInstance._foo).to.be.instanceOf(FooBar);
    });

    it ('should throw when transpiling errored typescript files', () => {
        global.Foo = new Namespace(__jymfony.autoload, 'Foo', fixturesDir, require);
        const FooWithError = Foo.ts.FooWithError;

        expect(() => new FooWithError('value')).to.throw();
    });
});
