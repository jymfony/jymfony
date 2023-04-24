const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class DebounceTest extends TestCase {
    async testShouldDebounceAFunction() {
        let callCount = 0;
        const debounced = __jymfony.debounce(function(value) {
            ++callCount;
            return value;
        }, 32);

        __self.assertEquals([ undefined, undefined, undefined ], [ debounced('a'), debounced('b'), debounced('c') ]);
        __self.assertEquals(0, callCount);

        await __jymfony.sleep(128);

        __self.assertEquals(1, callCount);
        __self.assertEquals([ 'c', 'c', 'c' ], [ debounced('d'), debounced('e'), debounced('f') ]);
        __self.assertEquals(1, callCount);

        await __jymfony.sleep(128);
        __self.assertEquals(2, callCount);
    }

    async testSubsequentDebouncedCallsReturnTheLastResult() {
        const debounced = __jymfony.debounce(v => v, 32);
        debounced('a');

        await __jymfony.sleep(64);
        __self.assertNotEquals('b', debounced('b'));

        await __jymfony.sleep(64);
        __self.assertNotEquals('c', debounced('c'));
    }

    async testShouldNotImmediatelyCallTheFunctionWhenWaitIs0() {
        let callCount = 0;
        const debounced = __jymfony.debounce(() => {
            ++callCount;
        }, 0);

        debounced();
        debounced();

        __self.assertEquals(0, callCount);

        await __jymfony.sleep(5);
        __self.assertEquals(1, callCount);
    }

    async testShouldApplyDefaultOptions() {
        let callCount = 0;
        const debounced = __jymfony.debounce(() => {
            callCount++;
        }, 32);

        debounced();
        __self.assertEquals(0, callCount);

        await __jymfony.sleep(64);
        __self.assertEquals(1, callCount);
    }

    async testShouldInvokeTheFunctionWithTheCorrectArgumentsAndThisBinding() {
        let actual, callCount = 0;

        const object = {};
        const debounced = __jymfony.debounce(function(...args) {
            actual = [ this ];
            actual.push(...args);

            ++callCount;
        }, 32);

        debounced.call(object, 'a');

        await __jymfony.sleep(64);
        __self.assertEquals(1, callCount);
        __self.assertEquals([ object, 'a' ], actual);
    }
}
