const RecursiveDirectoryIterator = Jymfony.Component.Config.Resource.Iterator.RecursiveDirectoryIterator;
const path = require('path');
const { expect } = require('chai');

describe('[Config] RecursiveDirectoryIterator', function () {
    it('should synchronously iterate through directory', () => {
        const resolved = [ ...__dirname.split(path.sep).slice(0, -3), 'fixtures', 'Iterator' ].join(path.sep);
        const itr = new RecursiveDirectoryIterator(resolved);
        const result = [];

        while (true) {
            const next = itr.next();
            expect(next.done).to.be.a('boolean');

            if (next.done) {
                break;
            }

            expect(next.value).to.be.a('string');
            result.push(next.value);
        }

        expect(result.sort()).to.be.deep.equal([
            resolved+path.sep+'TESTFILE.txt',
            resolved+path.sep+'Testdir'+path.sep+'Subdir'+path.sep+'another_dir'+path.sep+'test_file.txt',
            resolved+path.sep+'Testdir'+path.sep+'bazbaz.txt',
            resolved+path.sep+'Testdir'+path.sep+'foobar',
        ]);
    });
});
