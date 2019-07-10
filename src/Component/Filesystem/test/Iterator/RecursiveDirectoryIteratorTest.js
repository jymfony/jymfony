const RecursiveDirectoryIterator = Jymfony.Component.Filesystem.Iterator.RecursiveDirectoryIterator;

const { expect } = require('chai');
const path = require('path');

describe('[Filesystem] RecursiveDirectoryIterator', function () {
    it('should asynchronously iterate through directory', async () => {
        const resolved = [ ...__dirname.split(path.sep).slice(0, -2), 'fixtures', 'Testdir' ].join(path.sep);
        const itr = new RecursiveDirectoryIterator(resolved);
        const result = [];

        while (true) {
            const next = itr.next();
            expect(next).to.be.instanceOf(Promise);

            const file = await next;
            expect(file.done).to.be.a('boolean');

            if (file.done) {
                break;
            }

            expect(file.value).to.be.a('string');
            result.push(file.value);
        }

        expect(result.sort()).to.be.deep.equal([
            'file://'+resolved+path.sep+'Subdir'+path.sep+'another_dir'+path.sep+'test_file.txt',
            'file://'+resolved+path.sep+'bazbaz.txt',
            'file://'+resolved+path.sep+'foobar',
        ]);
    });

    it('should respect child first flag', async () => {
        const resolved = [ ...__dirname.split(path.sep).slice(0, -2), 'fixtures', 'Testdir' ].join(path.sep);
        const itr = new RecursiveDirectoryIterator(resolved, RecursiveDirectoryIterator.CHILD_FIRST);
        const result = [];

        await __jymfony.forAwait(itr, value => {
            result.push(value);
        });

        expect(result).to.be.deep.equal([
            'file://'+resolved+path.sep+'Subdir'+path.sep+'another_dir'+path.sep+'test_file.txt',
            'file://'+resolved+path.sep+'bazbaz.txt',
            'file://'+resolved+path.sep+'foobar',
        ]);
    });

    it('should respect child last flag', async () => {
        const resolved = [ ...__dirname.split(path.sep).slice(0, -2), 'fixtures', 'Testdir' ].join(path.sep);
        const itr = new RecursiveDirectoryIterator(resolved, RecursiveDirectoryIterator.CHILD_LAST);
        const result = [];

        await __jymfony.forAwait(itr, value => {
            result.push(value);
        });

        expect(result).to.be.deep.equal([
            'file://'+resolved+path.sep+'bazbaz.txt',
            'file://'+resolved+path.sep+'foobar',
            'file://'+resolved+path.sep+'Subdir'+path.sep+'another_dir'+path.sep+'test_file.txt',
        ]);
    });
});
