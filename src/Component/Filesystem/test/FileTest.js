import path from 'path';

const File = Jymfony.Component.Filesystem.File;
const OpenFile = Jymfony.Component.Filesystem.OpenFile;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class FileTest extends TestCase {
    get testCaseName() {
        return '[Filesystem] File';
    }

    testShouldResolvePath() {
        __self.assertEquals('file://' + path.join(process.cwd(), 'README.md'), new File('README.md').filename);
        __self.assertEquals('file://' + path.join(process.cwd(), 'README.md'), new File('file:README.md').filename);
    }

    testCouldBeConvertedToString() {
        const file = new File('README.md');
        __self.assertEquals('file://' + path.join(process.cwd(), 'README.md'), file.toString());
    }

    testPathShouldThePathOfTheFile() {
        __self.assertEquals('file://' + process.cwd(), new File('README.md').path);
        __self.assertEquals('file://' + path.resolve(__dirname+'/..'), new File(__dirname).path);

        __self.assertEquals('file://' + process.cwd(), new File('file:README.md').path);
        __self.assertEquals('https://www.example.com/', new File('https://www.example.com/').path);
        __self.assertEquals('https://www.example.com/', new File('https://www.example.com/test').path);
    }

    testGetBasenameShouldReturnTheBaseName() {
        __self.assertEquals('README.md', new File('README.md').getBasename());
        __self.assertEquals('README', new File('README.md').getBasename('.md'));

        __self.assertEquals('', new File('https://www.example.com/').getBasename());
        __self.assertEquals('test', new File('https://www.example.com/test').getBasename());
        __self.assertEquals('test.html', new File('https://www.example.com/test.html').getBasename());
        __self.assertEquals('test', new File('https://www.example.com/test.html').getBasename('.html'));
    }

    async testGetRealpathShouldReturnTheResolvedPath() {
        __self.assertEquals(path.resolve(__dirname + '/../fixtures/TESTFILE.txt'), await new File(__dirname + '/../fixtures/TESTFILE.txt').getRealpath());

        if (! __jymfony.Platform.isWindows()) {
            __self.assertEquals(path.resolve(__dirname + '/../fixtures/TESTFILE.txt'), await new File(__dirname + '/../fixtures/LINKFILE').getRealpath());
        }
    }

    async testGetSizeShouldReturnTheFileSize() {
        __self.assertEquals(15, await new File(__dirname + '/../fixtures/TESTFILE.txt').getSize());

        if (! __jymfony.Platform.isWindows()) {
            __self.assertEquals(15, await new File(__dirname + '/../fixtures/LINKFILE').getSize());
        }
    }

    async testIsDirectoryShouldReturnTheCorrecValue() {
        __self.assertTrue(await new File(__dirname).isDirectory());
        __self.assertFalse(await new File(__filename).isDirectory());
    }

    async testIsFileShouldReturnTheCorrectValue() {
        __self.assertFalse(await new File(__dirname).isFile());
        __self.assertTrue(await new File(__filename).isFile());
    }

    async testGetPermsShouldReturnTheCorrectValue() {
        __self.assertEquals(0o600, await new File(__filename).getPerms() & 0o700);
    }

    async testOpenFileShouldReturnAnOpenFileInstance() {
        const openFile = await new File(__dirname + '/../fixtures/TESTFILE.txt').openFile();
        __self.assertInstanceOf(OpenFile, openFile);

        await openFile.close();
    }
}
