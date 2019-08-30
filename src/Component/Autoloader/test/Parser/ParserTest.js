const { dirname, sep } = require('path');
const { readdirSync, readFileSync } = require('fs');
const folder = dirname(require.resolve('test262-parser-tests/package.json'));
const ClassLoader = require('../../src/ClassLoader');
const Finder = require('../../src/Finder');
const Compiler = require('../../src/Parser/Compiler');
const Generator = require('../../src/Parser/SourceMap/Generator');
const Parser = require('../../src/Parser/Parser');
const DescriptorStorage = require('../../src/DescriptorStorage');
const { expect } = require('chai');

describe('[Autoloader] Parser', function () {
    const parser = new Parser();
    const excluded = [
        '06f0deb843fbf358.js', // With statement. Not supported: all the generated code is in strict mode.
        '123285734ee7f954.js', // With statement. Not supported: all the generated code is in strict mode.
        '162fd7b4a7647a1b.js', // With statement. Not supported: all the generated code is in strict mode.
        '1e61843633dcb483.js', // With statement. Not supported: all the generated code is in strict mode.
        '2c4b264884006a8e.js', // With statement. Not supported: all the generated code is in strict mode.
        '2c5f4d039f9c7740.js', // With statement. Not supported: all the generated code is in strict mode.
        '32a9af0615bf7618.js', // With statement. Not supported: all the generated code is in strict mode.
        '3610e596404818d6.js', // With statement. Not supported: all the generated code is in strict mode.
        '3a5a7699f0631c6f.js', // With statement. Not supported: all the generated code is in strict mode.
        '5239dd0fc0effb71.js', // With statement. Not supported: all the generated code is in strict mode.
        '5333f04581124314.js', // With statement. Not supported: all the generated code is in strict mode.
        '55c15fe174790fb2.js', // With statement. Not supported: all the generated code is in strict mode.
        '560c364700fdb6b2.js', // With statement. Not supported: all the generated code is in strict mode.
        '5aca2791ab698851.js', // With statement. Not supported: all the generated code is in strict mode.
        '5d9d30af901ba176.js', // With statement. Not supported: all the generated code is in strict mode.
        '6b0e8bbdc3dca1c5.js', // With statement. Not supported: all the generated code is in strict mode.
        '7d8b61ba2a3a275c.js', // With statement. Not supported: all the generated code is in strict mode.
        '855b8dea36c841ed.js', // With statement. Not supported: all the generated code is in strict mode.
        '90fa9751ab71ce28.js', // With statement. Not supported: all the generated code is in strict mode.
        '927b1e0dd52248a6.js', // With statement. Not supported: all the generated code is in strict mode.
        '93d4c5dfbddf859d.js', // With statement. Not supported: all the generated code is in strict mode.
        '96ea36bc180f25d5.js', // With statement. Not supported: all the generated code is in strict mode.
        'a10929d2c1b0d792.js', // With statement. Not supported: all the generated code is in strict mode.
        'a2f26b79b01628f9.js', // With statement. Not supported: all the generated code is in strict mode.
        'ac73bc36bbc48890.js', // With statement. Not supported: all the generated code is in strict mode.
        'a41e5072dd6dda98.js', // With statement. Not supported: all the generated code is in strict mode.
        'a42a93f3af33bbc5.js', // With statement. Not supported: all the generated code is in strict mode.
        'afcf8bace3839da2.js', // With statement. Not supported: all the generated code is in strict mode.
        'b8705496c9c1ff60.js', // With statement. Not supported: all the generated code is in strict mode.
        'bd883e5fd1f09b69.js', // With statement. Not supported: all the generated code is in strict mode.
        'be2fd5888f434cbd.js', // With statement. Not supported: all the generated code is in strict mode.
        'cb625ce2970fe52a.js', // With statement. Not supported: all the generated code is in strict mode.
        'cf939dae739eacf6.js', // With statement. Not supported: all the generated code is in strict mode.
        'd88992e07614f506.js', // With statement. Not supported: all the generated code is in strict mode.
        'f658dbaa20c36388.js', // With statement. Not supported: all the generated code is in strict mode.
        '14199f22a45c7e30.js', // "let" as identifier. Not supported: let is reserved word in ES6
        '2ef5ba0343d739dc.js', // "let" as identifier. Not supported: let is reserved word in ES6
        '4f731d62a74ab666.js', // "let" as identifier. Not supported: let is reserved word in ES6
        '5654d4106d7025c2.js', // "let" as identifier. Not supported: let is reserved word in ES6
        '56e2ba90e05f5659.js', // "let" as identifier. Not supported: let is reserved word in ES6
        '5ecbbdc097bee212.js', // "let" as identifier. Not supported: let is reserved word in ES6
        '63c92209eb77315a.js', // "let" as identifier. Not supported: let is reserved word in ES6
        '65401ed8dc152370.js', // "let" as identifier. Not supported: let is reserved word in ES6
        '660f5a175a2d46ac.js', // "let" as identifier. Not supported: let is reserved word in ES6
        '6815ab22de966de8.js', // "let" as identifier. Not supported: let is reserved word in ES6
        '6b36b5ad4f3ad84d.js', // "let" as identifier. Not supported: let is reserved word in ES6
        '818ea8eaeef8b3da.js', // "let" as identifier. Not supported: let is reserved word in ES6
        '9aa93e1e417ce8e3.js', // "let" as identifier. Not supported: let is reserved word in ES6
        '9fe1d41db318afba.js', // "let" as identifier. Not supported: let is reserved word in ES6
        'a1594a4d0c0ee99a.js', // "let" as identifier. Not supported: let is reserved word in ES6
        'b885e6a35c04d915.js', // "let" as identifier. Not supported: let is reserved word in ES6
        'b8c98b5cd38f2bd9.js', // "let" as identifier. Not supported: let is reserved word in ES6
        'c442dc81201e2b55.js', // "let" as identifier. Not supported: let is reserved word in ES6
        'c8565124aee75c69.js', // "let" as identifier. Not supported: let is reserved word in ES6
        'df696c501125c86f.js', // "let" as identifier. Not supported: let is reserved word in ES6
        'ee4e8fa6257d810a.js', // "let" as identifier. Not supported: let is reserved word in ES6
        'f0d9a7a2f5d42210.js', // "let" as identifier. Not supported: let is reserved word in ES6
        'f0fbbdabdaca2146.js', // "let" as identifier. Not supported: let is reserved word in ES6
        'f2e41488e95243a8.js', // "let" as identifier. Not supported: let is reserved word in ES6
        'ffaf5b9d3140465b.js', // "let" as identifier. Not supported: let is reserved word in ES6
        'a91ad31c88855e59.js', // "implements", "interface", "package" as identifier. Not supported: reserved words in ES6
        'd22f8660531e1c1a.js', // "static" as identifier. Not supported: static is reserved word in ES6
        'e74a8d269a6abdb7.js', // "private", "protected", "public" as identifier. Not supported: reserved words in ES6
        'f4a61fcdefebb9d4.js', // "private", "protected", "public" as identifier. Not supported: reserved words in ES6
    ];

    const ignored = [
        '7b0a9215ec756496.js', // Multiline comment used as statement terminator
        '946bee37652a31fa.js', // HTML comment after multiline comment
        '9f0d8eb6f7ab8180.js', // HTML comment after multiline comment
    ];

    for (const filename of readdirSync(folder + sep + 'pass')) {
        if (excluded.includes(filename) /* || filename.endsWith('module.js') */) {
            continue;
        }

        it ('should pass ' + filename + ' test', ignored.includes(filename) ? undefined : () => {
            const fn = folder + sep + 'pass' + sep + filename;
            parser._descriptorStorage = new DescriptorStorage(new ClassLoader(__jymfony.autoload.finder, require('path'), require('vm')), fn);

            const content = readFileSync(fn, { encoding: 'utf-8' });
            const program = parser.parse(content);

            const compiler = new Compiler(new Generator());
            compiler.compile(program);

            expect(program).is.not.null;
        });
    }

    it ('should support cross-imports', () => {
        const loader = new ClassLoader(new Finder(), require('path'), require('vm'));
        const bar = loader.loadClass(__dirname + '/../../fixtures/imports/bar.js', null);
        const foo = loader.loadClass(__dirname + '/../../fixtures/imports/foo.js', null);

        const b = new bar();
        expect(b.trial(new foo())).to.be.true;
        expect(new foo().foo()).to.be.true;
    });
});
