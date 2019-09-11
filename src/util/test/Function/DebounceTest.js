require('../../lib/Function/Debounce');
const { expect } = require('chai');

describe('Debounce', function () {
    it('should debounce a function', async () => {
        let callCount = 0;
        const debounced = __jymfony.debounce(function(value) {
            ++callCount;
            return value;
        }, 32);

        expect([ debounced('a'), debounced('b'), debounced('c') ])
            .to.be.deep.equal([ undefined, undefined, undefined ]);
        expect(callCount).to.be.equal(0);

        await __jymfony.sleep(128);

        expect(callCount).to.be.equal(1);
        expect([ debounced('d'), debounced('e'), debounced('f') ])
            .to.be.deep.equal([ 'c', 'c', 'c' ]);
        expect(callCount).to.be.equal(1);

        await __jymfony.sleep(128);
        expect(callCount).to.be.equal(2);
    });

    it('subsequent debounced calls return the last `func` result', async () => {
        const debounced = __jymfony.debounce(v => v, 32);
        debounced('a');

        await __jymfony.sleep(64);
        expect(debounced('b')).not.to.be.equal('b');

        await __jymfony.sleep(64);
        expect(debounced('c')).not.to.be.equal('c');
    });

    it('should not immediately call `func` when `wait` is `0`', async () => {
        let callCount = 0;
        const debounced = __jymfony.debounce(() => {
            ++callCount;
        }, 0);

        debounced();
        debounced();

        expect(callCount).to.be.equal(0);

        await __jymfony.sleep(5);
        expect(callCount).to.be.equal(1);
    });

    it('should apply default options', async () => {
        let callCount = 0;
        const debounced = __jymfony.debounce(() => {
            callCount++;
        }, 32);

        debounced();
        expect(callCount).to.be.equal(0);

        await __jymfony.sleep(64);
        expect(callCount).to.be.equal(1);
    });

    it('should invoke the function with the correct arguments and `this` binding', async () => {
        let actual, callCount = 0;

        const object = {};
        const debounced = __jymfony.debounce(function(...args) {
            actual = [ this ];
            actual.push(...args);

            ++callCount;
        }, 32);

        debounced.call(object, 'a');

        await __jymfony.sleep(64);
        expect(callCount).to.be.equal(1);
        expect(actual).to.be.deep.equal([ object, 'a' ]);
    });
});
