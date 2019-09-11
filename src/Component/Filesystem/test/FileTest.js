const File = Jymfony.Component.Filesystem.File;
const OpenFile = Jymfony.Component.Filesystem.OpenFile;

const { expect } = require('chai');
const path = require('path');

describe('[Filesystem] File', function () {
    it('should resolve path', () => {
        expect(new File('README.md').filename).to.be.equal('file://' + path.join(process.cwd(), 'README.md'));
        expect(new File('file:README.md').filename).to.be.equal('file://' + path.join(process.cwd(), 'README.md'));
    });

    it('could be converted to string', () => {
        const file = new File('README.md');
        expect(file.toString()).to.be.equal('file://' + path.join(process.cwd(), 'README.md'));
    });

    it('path should the path of the file', () => {
        expect(new File('README.md').path).to.be.equal('file://' + process.cwd());
        expect(new File(__dirname).path).to.be.equal('file://' + path.resolve(__dirname+'/..'));

        expect(new File('file:README.md').path).to.be.equal('file://' + process.cwd());
        expect(new File('https://www.example.com/').path).to.be.equal('https://www.example.com/');
        expect(new File('https://www.example.com/test').path).to.be.equal('https://www.example.com/');
    });

    it('getBasename should return the base name', () => {
        expect(new File('README.md').getBasename()).to.be.equal('README.md');
        expect(new File('README.md').getBasename('.md')).to.be.equal('README');

        expect(new File('https://www.example.com/').getBasename()).to.be.equal('');
        expect(new File('https://www.example.com/test').getBasename()).to.be.equal('test');
        expect(new File('https://www.example.com/test.html').getBasename()).to.be.equal('test.html');
        expect(new File('https://www.example.com/test.html').getBasename('.html')).to.be.equal('test');
    });

    it('getRealpath should return the resolved path', async () => {
        expect(await new File(__dirname + '/../fixtures/TESTFILE.txt').getRealpath())
            .to.be.equal(path.resolve(__dirname + '/../fixtures/TESTFILE.txt'));

        if (! __jymfony.Platform.isWindows()) {
            expect(await new File(__dirname + '/../fixtures/LINKFILE').getRealpath())
                .to.be.equal(path.resolve(__dirname + '/../fixtures/TESTFILE.txt'));
        }
    });

    it('getSize should return the file size', async () => {
        expect(await new File(__dirname + '/../fixtures/TESTFILE.txt').getSize()).to.be.equal(15);

        if (! __jymfony.Platform.isWindows()) {
            expect(await new File(__dirname + '/../fixtures/LINKFILE').getSize()).to.be.equal(15);
        }
    });

    it('isDirectory should return the correct value', async () => {
        expect(await new File(__dirname).isDirectory()).to.be.true;
        expect(await new File(__filename).isDirectory()).to.be.false;
    });

    it('isFile should return the correct value', async () => {
        expect(await new File(__dirname).isFile()).to.be.false;
        expect(await new File(__filename).isFile()).to.be.true;
    });

    it('getPerms should return the correct value', async () => {
        expect(await new File(__filename).getPerms() & 0o700).to.be.equal(0o600);
    });

    it('openFile should return an OpenFile instance', async () => {
        expect(await new File(__dirname + '/../fixtures/TESTFILE.txt').openFile()).to.be.instanceOf(OpenFile);
    });
});
