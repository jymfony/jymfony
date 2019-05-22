const expect = require('chai').expect;

class TestException extends Exception {}

describe('[Exceptions] Exception', function () {
    it('registered in global namespace', () => {
        return expect(Exception).to.be.not.undefined;
    });

    it('Is instance of Error', () => {
        return expect(new Exception()).to.be.an.instanceof(Error);
    });

    it('Inherits name', () => {
        return expect((new TestException()).name).to.be.equal('TestException');
    });

    it('Captures stack', () => {
        const ex = new Exception();
        return expect(ex.stack).to.be.not.empty;
    });

    it('should parse async stack traces', __jymfony.version_compare(process.versions.v8, '7.3', '>=') ? () => {
        async function functionOne() {
            await new Promise((resolve) => {
                setTimeout(() => resolve(), 1);
            });

            throw new Error('Something Bad');
        }

        async function functionTwo() {
            await functionOne();
        }

        functionTwo().catch((error) => {
            const stack = Exception.parseStackTrace(error);
            expect(stack).to.have.length(2);
            expect(stack[0].function).to.be.equal('functionOne');
            expect(stack[1].function).to.be.equal('functionTwo');
        });
    } : undefined);
});
