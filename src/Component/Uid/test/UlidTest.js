import { expect } from 'chai';

const Ulid = Jymfony.Component.Uid.Ulid;
const UuidV4 = Jymfony.Component.Uid.UuidV4;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const TimeSensitiveTestCaseTrait = Jymfony.Component.Testing.Framework.TimeSensitiveTestCaseTrait;

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

export default class UlidTest extends mix(TestCase, TimeSensitiveTestCaseTrait) {
    get testCaseName() {
        return '[Uid] ' + super.testCaseName;
    }

    testGenerate() {
        const time = String(new Date().getTime());

        let a = new Ulid(Ulid.generate(time));
        let b = new Ulid(Ulid.generate(time));

        a = a.toString();
        b = b.toString();

        expect(a.substr(0, 20)).to.be.equal(b.substr(0, 20));

        a = Number.parseInt(__jymfony.strtr(a.substr(a.length - 6), replacePairs), 32);
        b = Number.parseInt(__jymfony.strtr(b.substr(b.length - 6), replacePairs), 32);

        expect(b - a).to.be.equal(1);
    }

    testWithInvalidUlid() {
        this.expectException(InvalidArgumentException);
        this.expectExceptionMessage('Invalid ULID: "this is not a ulid".');

        // eslint-disable-next-line no-new
        new Ulid('this is not a ulid');
    }

    testBinary() {
        let ulid = new Ulid('00000000000000000000000000');
        expect(ulid.toBuffer().toString('binary')).to.be.equal('\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0');

        ulid = new Ulid('3zzzzzzzzzzzzzzzzzzzzzzzzz');
        expect(ulid.toBuffer().toString('hex')).to.be.equal('7fffffffffffffffffffffffffffffff');

        const buf = Buffer.from('7fffffffffffffffffffffffffffffff', 'hex');
        expect(ulid.equals(Ulid.fromString(buf.toString('binary')))).to.be.equal(true);
    }

    testFromUuid() {
        const uuid = new UuidV4();
        const ulid = Ulid.fromString(String(uuid));

        expect(String(ulid)).to.be.equal(uuid.toBase32());
        expect(String(ulid)).to.be.equal(ulid.toBase32());
        expect(String(uuid)).to.be.equal(ulid.toRfc4122());
        expect(ulid.equals(Ulid.fromString(String(uuid)))).to.be.equals(true);
    }

    testBase58() {
        let ulid = new Ulid('00000000000000000000000000');
        expect(ulid.toBase58()).to.be.equal('1111111111111111111111');

        ulid = Ulid.fromString('\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF');
        expect(ulid.toBase58()).to.be.equal('YcVfxkQb6JRzqk5kF2tNLv');
        expect(ulid.equals(Ulid.fromString('YcVfxkQb6JRzqk5kF2tNLv'))).to.be.equal(true);
    }

    testGetTime() {
        const nTime = new Date().getTime();
        let time = String(nTime);

        const ulid = new Ulid(Ulid.generate(time));
        time = time.substr(11) + '.' + time.substr(2, 3);

        expect(ulid.getTime()).to.be.equal(Number.parseFloat(time));
    }

    testIsValid() {
        expect(Ulid.isValid('not a ulid')).to.be.equal(false);
        expect(Ulid.isValid('00000000000000000000000000')).to.be.equal(true);
    }

    testEquals() {
        const a = new Ulid();
        const b = new Ulid();

        expect(a.equals(a)).to.be.equal(true);
        expect(a.equals(b)).to.be.equal(false);
        expect(a.equals(b.toString())).to.be.equal(false);
    }

    testCompare() {
        const nTime = new Date().getTime();
        const time = String(nTime);

        const a = new Ulid(Ulid.generate(time));
        const b = new Ulid(Ulid.generate(time));

        expect(a.compare(a)).to.be.equal(0);
        expect(a.compare(b)).to.be.lessThan(0);
        expect(b.compare(a)).to.be.greaterThan(0);

        const c = new Ulid(Ulid.generate(String(nTime + 1001)));

        expect(b.compare(c)).to.be.lessThan(0);
        expect(c.compare(b)).to.be.greaterThan(0);
    }
}
