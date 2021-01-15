import path from 'path';

const RecursiveDirectoryIterator = Jymfony.Component.Filesystem.Iterator.RecursiveDirectoryIterator;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class RecursiveDirectoryIteratorTest extends TestCase {
    get testCaseName() {
        return '[Filesystem] RecursiveDirectoryIterator';
    }

    async testShouldAsynchronouslyIterateThroughDirectory() {
        const resolved = [ ...__dirname.split(path.sep).slice(0, -2), 'fixtures', 'Testdir' ].join(path.sep);
        const itr = new RecursiveDirectoryIterator(resolved);
        const result = [];

        while (true) {
            const next = itr.next();
            __self.assertInstanceOf(Promise, next);

            const file = await next;
            __self.assertIsBoolean(file.done);

            if (file.done) {
                break;
            }

            __self.assertIsString(file.value);
            result.push(file.value);
        }

        __self.assertEquals([
            'file://'+resolved+path.sep+'Subdir'+path.sep+'another_dir'+path.sep+'test_file.txt',
            'file://'+resolved+path.sep+'bazbaz.txt',
            'file://'+resolved+path.sep+'foobar',
        ], result.sort());
    }

    async testShouldRespectChildFirstFlag() {
        const resolved = [ ...__dirname.split(path.sep).slice(0, -2), 'fixtures', 'Testdir' ].join(path.sep);
        const itr = new RecursiveDirectoryIterator(resolved, RecursiveDirectoryIterator.CHILD_FIRST);
        const result = [];

        await __jymfony.forAwait(itr, value => {
            result.push(value);
        });

        __self.assertEquals([
            'file://'+resolved+path.sep+'Subdir'+path.sep+'another_dir'+path.sep+'test_file.txt',
            'file://'+resolved+path.sep+'bazbaz.txt',
            'file://'+resolved+path.sep+'foobar',
        ], result);
    }

    async testShouldRespectChildLastFlag() {
        const resolved = [ ...__dirname.split(path.sep).slice(0, -2), 'fixtures', 'Testdir' ].join(path.sep);
        const itr = new RecursiveDirectoryIterator(resolved, RecursiveDirectoryIterator.CHILD_LAST);
        const result = [];

        await __jymfony.forAwait(itr, value => {
            result.push(value);
        });

        __self.assertEquals([
            'file://'+resolved+path.sep+'bazbaz.txt',
            'file://'+resolved+path.sep+'foobar',
            'file://'+resolved+path.sep+'Subdir'+path.sep+'another_dir'+path.sep+'test_file.txt',
        ], result);
    }
}
