const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class LevenshteinTest extends TestCase {
    testEquals() {
        __self.assertEquals(0, __jymfony.levenshtein('12345', '12345'));
    }

    test1stEmpty() {
        __self.assertEquals(3, __jymfony.levenshtein('', 'xyz'));
    }

    test2ndEmpty() {
        __self.assertEquals(3, __jymfony.levenshtein('xyz', ''));
    }

    testBothEmpty() {
        __self.assertEquals(0, __jymfony.levenshtein('', ''));
    }

    test1Char() {
        __self.assertEquals(1, __jymfony.levenshtein('1', '2'));
    }

    test2CharSwap() {
        __self.assertEquals(2, __jymfony.levenshtein('12', '21'));
    }

    testDelete() {
        __self.assertEquals(2, __jymfony.levenshtein('2121', '11'));
    }

    testInsert() {
        __self.assertEquals(2, __jymfony.levenshtein('11', '2121'));
    }

    testReplace() {
        __self.assertEquals(1, __jymfony.levenshtein('121', '111'));
    }
}
