const MimeTypes = Jymfony.Component.Mime.MimeTypes;
const MimeTypeGuesserInterface = Jymfony.Component.Mime.MimeTypeGuesserInterface;

const { expect } = require('chai');

describe('[Mime] MimeTypes', function () {
    it('should skip unsupported guesser', __jymfony.Platform.isWindows() ? undefined : async () => {
        const mt = new MimeTypes();
        mt.registerGuesser(new class extends implementationOf(MimeTypeGuesserInterface) {
            isGuesserSupported() {
                return false;
            }

            guessMimeType() {
                throw new RuntimeException('Should never be called');
            }
        }());

        expect(await mt.guessMimeType(__dirname + '/../fixtures/test')).to.be.equal('image/gif');
    });

    it('get extensions', () => {
        const mt = new MimeTypes();
        expect(mt.getExtensions('application/mbox')).to.be.deep.equal([ 'mbox' ]);
        expect(mt.getExtensions('application/postscript')).to.be.deep.equal([ 'ai', 'eps', 'ps' ]);
        expect(mt.getExtensions('application/whatever-jymfony')).to.be.deep.equal([]);
    });

    it('get mime types', () => {
        const mt = new MimeTypes();
        expect(mt.getMimeTypes('mbox')).to.be.deep.equal([ 'application/mbox' ]);
        expect(mt.getMimeTypes('ai')).to.contain('application/postscript');
        expect(mt.getMimeTypes('ps')).to.contain('application/postscript');
        expect(mt.getMimeTypes('jymfony')).to.be.deep.equal([]);
    });
});
