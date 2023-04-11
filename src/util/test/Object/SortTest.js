const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class SortTest extends TestCase {
    testStringSortsByStringValue() {
        __self.assertEquals({ foo: 'action', baz: 'echo', bar: 'zulu' }, Object.sort({ foo: 'action', bar: 'zulu', baz: 'echo' }));
    }

    testStringSortsByKey() {
        __self.assertEquals({ bar: 'zulu', baz: 'echo', foo: 'action' }, Object.ksort({ foo: 'action', bar: 'zulu', baz: 'echo' }));
    }

    testNumberSortsByStringValue() {
        __self.assertEquals({ foo: 0, baz: 20, bar: 1000 }, Object.sort({ foo: 0, bar: 1000, baz: 20 }));
    }

    testNumberSortsByKey() {
        __self.assertEquals({ 10: 'zulu', 25: 'echo', 50: 'action' }, Object.ksort({ 50: 'action', 10: 'zulu', 25: 'echo' }));
    }

    testSortsByStringValue() {
        __self.assertEquals({ foo: 0, baz: 20, bar: 'echo', foobar: 'zulu' }, Object.sort({ foo: 0, bar: 'echo', baz: 20, foobar: 'zulu' }));
    }

    testSortsByKey() {
        __self.assertEquals({ 10: 'zulu', 25: 'echo', 'tango': 'action', 'sierra': 'foxtrot' }, Object.ksort({ 'tango': 'action', 10: 'zulu', 25: 'echo', 'sierra': 'foxtrot' }));
    }
}
