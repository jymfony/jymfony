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

    it('should parse stack traces without line', () => {
        const stack = `
    at CallCenter.makeCall (/var/jymfony/src/Component/Testing/src/Call/CallCenter.js)
    at ObjectProphecy.makeProphecyMethodCall (/var/jymfony/src/Component/Testing/src/Prophecy/ObjectProphecy.js)
    at /var/jymfony/src/Component/EventDispatcher/src/Debug/TraceableEventDispatcher.js`;

        expect(Exception.parseStackTrace({ stack })).to.be.deep.equal([
            { file: '/var/jymfony/src/Component/Testing/src/Call/CallCenter.js', function: 'CallCenter.makeCall', line: 0 },
            { file: '/var/jymfony/src/Component/Testing/src/Prophecy/ObjectProphecy.js', function: 'ObjectProphecy.makeProphecyMethodCall', line: 0 },
            { file: '/var/jymfony/src/Component/EventDispatcher/src/Debug/TraceableEventDispatcher.js', function: '?', line: 0 },
        ]);
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
