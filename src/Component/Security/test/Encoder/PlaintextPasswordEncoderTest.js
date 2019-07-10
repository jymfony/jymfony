const PlaintextPasswordEncoder = Jymfony.Component.Security.Encoder.PlaintextPasswordEncoder;
const { expect } = require('chai');

describe('[Security] PlaintextPasswordEncoder', function () {
    it('password is valid', async () => {
        const encoder = new PlaintextPasswordEncoder();

        expect(await encoder.isPasswordValid('foo', 'foo', '')).to.be.true;
        expect(await encoder.isPasswordValid('bar', 'foo', '')).to.be.false;
        expect(await encoder.isPasswordValid('FOO', 'foo', '')).to.be.false;
    });

    it('password is valid and case should be ignored', async () => {
        const encoder = new PlaintextPasswordEncoder(true);

        expect(await encoder.isPasswordValid('foo', 'foo', '')).to.be.true;
        expect(await encoder.isPasswordValid('bar', 'foo', '')).to.be.false;
        expect(await encoder.isPasswordValid('FOO', 'foo', '')).to.be.true;
    });

    it('should encode password', async () => {
        const encoder = new PlaintextPasswordEncoder();

        expect(await encoder.encodePassword('foo', '')).to.be.equal('foo');
        expect(await encoder.encodePassword('foo', 'bar')).to.be.equal('foo{bar}');

        try {
            await encoder.encodePassword('foo', '{bar}');
            throw new Error('should not reach this point');
        } catch (e) {
            expect(e).to.be.instanceOf(InvalidArgumentException);
        }
    });
});
