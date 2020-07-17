const { expect } = require('chai');

/*
 * We are testing autoloader component here
 * cannot use the autoloader itself to load classes! :)
 */
const ClassLoader = require('../src/ClassLoader');
const Finder = require('../src/Finder');

describe('[Autoloader] ClassLoader', function () {
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
});
