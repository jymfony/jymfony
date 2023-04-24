const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class Crc32Test extends TestCase {
    testEmpty() {
        __self.assertEquals(0, __jymfony.crc32(''));
        __self.assertEquals(0, __jymfony.crc32(Buffer.from('')));
    }

    testVector() {
        __self.assertEquals(0xcbf43926, __jymfony.crc32('123456789'));
        __self.assertEquals(0xcbf43926, __jymfony.crc32(Buffer.from('123456789')));
    }
}
