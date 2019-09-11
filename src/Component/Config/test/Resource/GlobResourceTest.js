const GlobResource = Jymfony.Component.Config.Resource.GlobResource;
const path = require('path');
const { expect } = require('chai');

describe('[Config] GlobResource', function () {
    it('should iterate with pattern', () => {
        const resolved = [ ...__dirname.split(path.sep).slice(0, -2), 'fixtures', 'Iterator' ].join(path.sep);
        const itr = new GlobResource(resolved, '/**/*.txt');
        const result = [];

        for (const file of itr) {
            result.push(file);
        }

        expect(result.sort()).to.be.deep.equal([
            resolved+path.sep+'TESTFILE.txt',
            resolved+path.sep+'Testdir'+path.sep+'Subdir'+path.sep+'another_dir'+path.sep+'test_file.txt',
            resolved+path.sep+'Testdir'+path.sep+'bazbaz.txt',
        ]);
    });
});
