const Ulid = Jymfony.Component.Uid.Ulid;
const UuidV4 = Jymfony.Component.Uid.UuidV4;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

const replacePairs = {
    'A': 'a',
    'B': 'b',
    'C': 'c',
    'D': 'd',
    'E': 'e',
    'F': 'f',
    'G': 'g',
    'H': 'h',
    'J': 'i',
    'K': 'j',
    'M': 'k',
    'N': 'l',
    'P': 'm',
    'Q': 'n',
    'R': 'o',
    'S': 'p',
    'T': 'q',
    'V': 'r',
    'W': 's',
    'X': 't',
    'Y': 'u',
    'Z': 'v',
};

export default @timeSensitive() class UlidTest extends TestCase {
    get testCaseName() {
        return '[Uid] ' + super.testCaseName;
    }

    get retries() {
        return 3;
    }

    testGenerate() {
        const time = String(new Date().getTime());

        let a = new Ulid(Ulid.generate(time));
        let b = new Ulid(Ulid.generate(time));

        a = a.toString();
        b = b.toString();

        __self.assertEquals(b.substring(0, 20), a.substring(0, 20));

        a = Number.parseInt(__jymfony.strtr(a.substring(a.length - 6), replacePairs), 32);
        b = Number.parseInt(__jymfony.strtr(b.substring(b.length - 6), replacePairs), 32);

        __self.assertEquals(1, b - a);
    }

    testWithInvalidUlid() {
        this.expectException(InvalidArgumentException);
        this.expectExceptionMessage('Invalid ULID: "this is not a ulid".');

        // eslint-disable-next-line no-new
        new Ulid('this is not a ulid');
    }

    testBinary() {
        let ulid = new Ulid('00000000000000000000000000');
        __self.assertEquals('\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0', ulid.toBuffer().toString('binary'));

        ulid = new Ulid('3zzzzzzzzzzzzzzzzzzzzzzzzz');
        __self.assertEquals('7fffffffffffffffffffffffffffffff', ulid.toBuffer().toString('hex'));

        const buf = Buffer.from('7fffffffffffffffffffffffffffffff', 'hex');
        __self.assertEquals(true, ulid.equals(Ulid.fromString(buf.toString('binary'))));
    }

    testFromUuid() {
        const uuid = new UuidV4();
        const ulid = Ulid.fromString(String(uuid));

        __self.assertEquals(uuid.toBase32(), String(ulid));
        __self.assertEquals(ulid.toBase32(), String(ulid));
        __self.assertEquals(ulid.toRfc4122(), String(uuid));
        __self.assertEquals(true, ulid.equals(Ulid.fromString(String(uuid))));
    }

    testBase58() {
        let ulid = new Ulid('00000000000000000000000000');
        __self.assertEquals('1111111111111111111111', ulid.toBase58());

        ulid = Ulid.fromString('\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF');
        __self.assertEquals('YcVfxkQb6JRzqk5kF2tNLv', ulid.toBase58());
        __self.assertEquals(true, ulid.equals(Ulid.fromString('YcVfxkQb6JRzqk5kF2tNLv')));
    }

    testGetTime() {
        const nTime = new Date().getTime();
        let time = String(nTime);

        const ulid = new Ulid(Ulid.generate(time));
        time = time.substr(11) + '.' + time.substr(2, 3);

        __self.assertEquals(Number.parseFloat(time), ulid.getTime());
    }

    testIsValid() {
        __self.assertEquals(false, Ulid.isValid('not a ulid'));
        __self.assertEquals(true, Ulid.isValid('00000000000000000000000000'));
    }

    testEquals() {
        const a = new Ulid();
        const b = new Ulid();

        __self.assertEquals(true, a.equals(a));
        __self.assertEquals(false, a.equals(b));
        __self.assertEquals(false, a.equals(b.toString()));
    }

    async testCompare() {
        const a = new Ulid();
        const b = new Ulid();

        __self.assertEquals(0, a.compare(a));
        __self.assertLessThan(0, a.compare(b));
        __self.assertGreaterThan(0, b.compare(a));

        await __jymfony.sleep(1001);
        const c = new Ulid();

        __self.assertLessThan(0, b.compare(c));
        __self.assertGreaterThan(0, c.compare(b));
    }
}
