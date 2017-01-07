require('../../lib/Function/getFunction');
const expect = require('chai').expect;

class TestObject {
    foo() { }
    static bar() { }
}

describe('getFunction', function () {
    it ('should retrieve function from object', () => {
        let fn = __jymfony.getFunction(new TestObject(), 'foo');
        expect(fn).to.be.instanceOf(Function);
        expect(fn).to.be.equal(TestObject.prototype.foo);
    });

    it ('should retrieve static function from object', () => {
        let fn = __jymfony.getFunction(new TestObject(), 'bar');
        expect(fn).to.be.instanceOf(Function);
        expect(fn).to.be.equal(TestObject.bar);
    });

    it ('should throw if not found', () => {
        try {
            __jymfony.getFunction(new TestObject(), 'non-existent');
        } catch (e) {
            expect(e).to.be.instanceOf(RuntimeException);
            return;
        }

        throw new Error('FAIL');
    });
});
