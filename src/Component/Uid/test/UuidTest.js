import { @dataProvider } from '@jymfony/decorators';
import { expect } from 'chai';

const NilUuid = Jymfony.Component.Uid.NilUuid;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const Ulid = Jymfony.Component.Uid.Ulid;
const Uuid = Jymfony.Component.Uid.Uuid;
const UuidV1 = Jymfony.Component.Uid.UuidV1;
const UuidV3 = Jymfony.Component.Uid.UuidV3;
const UuidV4 = Jymfony.Component.Uid.UuidV4;
const UuidV5 = Jymfony.Component.Uid.UuidV5;
const UuidV6 = Jymfony.Component.Uid.UuidV6;

const A_UUID_V1 = 'd9e7a184-5d5b-11ea-a62a-3499710062d0';
const A_UUID_V4 = 'd6b3345b-2905-4048-a83c-b5988e765d98';

export default class UuidTest extends TestCase {
    get testCaseName() {
        return '[Uid] ' + super.testCaseName;
    }

    testConstructorWithInvalidUuid() {
        this.expectException(InvalidArgumentException);
        this.expectExceptionMessage('Invalid UUID: "this is not a uuid".');

        Uuid.fromString('this is not a uuid');
    }

    testConstructorWithValidUuid() {
        const uuid = new UuidV4(A_UUID_V4);

        expect(String(uuid)).to.be.equal(A_UUID_V4);
        expect(JSON.stringify(uuid)).to.be.equal('"' + A_UUID_V4 + '"');
    }

    testV1() {
        let uuid = Uuid.v1();

        expect(uuid).to.be.instanceOf(UuidV1);

        uuid = new UuidV1(A_UUID_V1);

        expect(uuid.getTime()).to.be.equal(1583245966.7464576);
        expect(uuid.getNode()).to.be.equal('3499710062d0');
    }

    testV3() {
        const uuid = Uuid.v3(new UuidV4(A_UUID_V4), 'the name');

        expect(uuid).to.be.instanceOf(UuidV3);
        expect(String(uuid)).to.be.equal('8dac64d3-937a-3e7c-aa1d-d5d6c06a61f5');
    }

    testV4() {
        const uuid = Uuid.v4();

        expect(uuid).to.be.instanceOf(UuidV4);
    }

    testV5() {
        const uuid = Uuid.v5(new UuidV4('ec07aa88-f84e-47b9-a581-1c6b30a2f484'), 'the name');

        expect(uuid).to.be.instanceOf(UuidV5);
        expect(String(uuid)).to.be.equal('851def0c-b9c7-55aa-a991-130e769ec0a9');
    }

    testV6() {
        let uuid = Uuid.v6();

        expect(uuid).to.be.instanceOf(UuidV6);

        const v6str = A_UUID_V1.substr(0, 14) + '6' + A_UUID_V1.substr(15);
        uuid = new UuidV6(v6str);

        expect(uuid.getTime()).to.be.equal(85916308548.27832);
        expect(uuid.getNode()).to.be.equal('3499710062d0');
    }

    testV6IsSeeded() {
        const uuidV1 = Uuid.v1();
        const uuidV6 = Uuid.v6();

        expect(String(uuidV1).substr(24)).not.to.be.equal(String(uuidV6).substr(24));
    }

    testBinary() {
        let uuid = new UuidV4(A_UUID_V4);
        uuid = Uuid.fromString(uuid.toBuffer().toString('binary'));

        expect(uuid).to.be.instanceOf(UuidV4);
        expect(uuid.toString()).to.be.equal(A_UUID_V4);
    }

    testFromUlid() {
        const ulid = new Ulid();
        const uuid = Uuid.fromString(String(ulid));

        expect(String(ulid)).to.be.equal(uuid.toBase32());
        expect(String(uuid)).to.be.equal(uuid.toRfc4122());
        expect(uuid.equals(Uuid.fromString(String(ulid)))).to.be.true;
    }

    testBase58() {
        let uuid = new NilUuid();
        expect(uuid.toBase58()).to.be.equal('1111111111111111111111');

        uuid = Uuid.fromString("\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF");
        expect(uuid.toBase58()).to.be.equal('YcVfxkQb6JRzqk5kF2tNLv');
        expect(uuid.equals(Uuid.fromString('YcVfxkQb6JRzqk5kF2tNLv'))).to.be.true;
    }

    testIsValid() {
        expect(Uuid.isValid('not a uuid')).to.be.false;
        expect(Uuid.isValid(A_UUID_V4)).to.be.true;
        expect(UuidV4.isValid(A_UUID_V1)).to.be.false;
        expect(UuidV4.isValid(A_UUID_V4)).to.be.true;
    }

    testEquals() {
        const uuid1 = new UuidV1(A_UUID_V1);
        const uuid2 = new UuidV4(A_UUID_V4);

        expect(uuid1.equals(uuid1)).to.be.true;
        expect(uuid1.equals(uuid2)).to.be.false;
    }

    @dataProvider('provideInvalidEqualType')
    testEqualsAgainstOtherType(other) {
        expect((new UuidV4(A_UUID_V4)).equals(other)).to.be.false;
    }

    * provideInvalidEqualType() {
        yield [ null ];
        yield [ A_UUID_V1 ];
        yield [ A_UUID_V4 ];
        yield [ {} ];
    }

    testCompare() {
        const b = new Uuid('00000000-0000-0000-0000-00000000000b');
        const a = new Uuid('00000000-0000-0000-0000-00000000000a');
        const d = new Uuid('00000000-0000-0000-0000-00000000000d');
        const c = new Uuid('00000000-0000-0000-0000-00000000000c');

        const uuids = [ b, a, d, c ].sort((a, b) => a.compare(b));
        expect(uuids).to.be.deep.equal([ a, b, c, d ]);
    }

    testNilUuid() {
        const uuid = Uuid.fromString('00000000-0000-0000-0000-000000000000');

        expect(uuid).to.be.instanceOf(NilUuid);
        expect(uuid.toString()).to.be.equal('00000000-0000-0000-0000-000000000000');
    }
}
