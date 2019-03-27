require('../lib/is');
const expect = require('chai').expect;

class InvokableObject {
    __invoke(arg) {
        return 'inv_' + arg;
    }
}

describe('Is', function () {
    it('isFunction should work', () => {
        expect(isFunction(function () {})).to.be.true;
        expect(isFunction(() => {})).to.be.true;
        expect(isFunction(function * () { })).to.be.true;
        expect(isFunction(async function () { })).to.be.true;
        expect(isFunction(new InvokableObject())).to.be.true;

        if (__jymfony.Platform.hasAsyncGeneratorFunctionSupport()) {
            eval('expect(isFunction(async function* () {})).to.be.true');
        }

        expect(isFunction('foobar')).to.be.false;
        expect(isFunction(42)).to.be.false;
        expect(isFunction({})).to.be.false;
        expect(isFunction([])).to.be.false;
        expect(isFunction([ 'go', 'go' ])).to.be.false;
    });
});
