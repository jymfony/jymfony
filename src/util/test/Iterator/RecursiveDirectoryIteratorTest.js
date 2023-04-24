const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const path = require('path');

export default class RecursiveDirectoryIteratorTest extends TestCase {
    testShouldSynchronouslyIterateThroughDirectories() {
        const resolved = [ ...__dirname.split(path.sep).slice(0, -2), 'fixtures', 'Iterator' ].join(path.sep);
        const itr = new RecursiveDirectoryIterator(resolved);
        const result = [];

        while (true) {
            const next = itr.next();
            __self.assertIsBoolean(next.done);

            if (next.done) {
                break;
            }

            __self.assertIsString(next.value);
            result.push(next.value);
        }

        __self.assertEquals([
            resolved+path.sep+'TESTFILE.txt',
            resolved+path.sep+'Testdir',
            resolved+path.sep+'Testdir'+path.sep+'Subdir',
            resolved+path.sep+'Testdir'+path.sep+'Subdir'+path.sep+'another_dir',
            resolved+path.sep+'Testdir'+path.sep+'Subdir'+path.sep+'another_dir'+path.sep+'test_file.txt',
            resolved+path.sep+'Testdir'+path.sep+'bazbaz.txt',
            resolved+path.sep+'Testdir'+path.sep+'foobar',
        ], result.sort());
    }
}
