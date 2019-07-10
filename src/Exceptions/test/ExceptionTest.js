const { expect } = require('chai');

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

    const [ major, minor ] = process.versions.v8.split('.', 3);
    it('should parse async stack traces', 7 < ~~major || (7 === ~~major && 3 <= ~~minor) ? () => {
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
