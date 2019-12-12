const Compiler = require('../../src/Parser/Compiler');
const Generator = require('../../src/Parser/SourceMap/Generator');
const Parser = require('../../src/Parser/Parser');
const { expect } = require('chai');

describe('[Autoloader] Compiler', function () {
    const parser = new Parser();
    const generator = new class extends Generator {
        toString() {
            return '';
        }

        toJSON() {
            return {};
        }
    }();

    it ('should compile assert expressions in debug', () => {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = true;

        try {
            const program = parser.parse('__assert(foo instanceof Foo);');

            const compiler = new Compiler(generator);
            const compiled = compiler.compile(program);
            expect(compiled).to.be.equal('__assert(foo instanceof Foo);');
        } finally {
            __jymfony.autoload.debug = debug;
        }
    });

    it ('should not compile assert expressions when not in debug', () => {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = parser.parse('__assert(foo instanceof Foo);');

            const compiler = new Compiler(generator);
            const compiled = compiler.compile(program);
            expect(compiled).to.be.equal(';');
        } finally {
            __jymfony.autoload.debug = debug;
        }
    });
});
