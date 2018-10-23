const MessageDigestPasswordEncoder = Jymfony.Component.Security.Encoder.MessageDigestPasswordEncoder;
const crypto = require('crypto');
const expect = require('chai').expect;

describe('[Security] MessageDigestPasswordEncoder', function () {
    const hash = (algo, value, base64 = false) => {
        const hash = crypto.createHash(algo);
        hash.update(value);
        const digest = hash.digest();

        return base64 ? digest.toString('base64') : digest.toString('binary');
    };

    it('password is valid', async () => {
        const encoder = new MessageDigestPasswordEncoder('sha256', false, 1);

        expect(await encoder.isPasswordValid(hash('sha256', 'foo'), 'foo', '')).to.be.true;
        expect(await encoder.isPasswordValid(hash('sha256', 'bar'), 'foo', '')).to.be.false;
    });

    it('should encode password', async () => {
        let encoder = new MessageDigestPasswordEncoder('sha256', false, 1);
        expect(await encoder.encodePassword('foo', '')).to.be.equal(hash('sha256', 'foo'));

        encoder = new MessageDigestPasswordEncoder('sha256', true, 1);
        expect(await encoder.encodePassword('foo', '')).to.be.equal(hash('sha256', 'foo', true));

        encoder = new MessageDigestPasswordEncoder('sha256', false, 2);
        expect(await encoder.encodePassword('foo', '')).to.be.equal(hash('sha256', hash('sha256', 'foo')+'foo'));
    });
});
