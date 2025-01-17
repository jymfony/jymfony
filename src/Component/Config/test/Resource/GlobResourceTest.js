import { sep } from 'path';
const GlobResource = Jymfony.Component.Config.Resource.GlobResource;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class GlobResourceTest extends TestCase {
    get testCaseName() {
        return '[Config] ' + super.testCaseName;
    }

    testShouldIterateWithPattern() {
        const resolved = [ ...__dirname.split(sep).slice(0, -2), 'fixtures', 'Iterator' ].join(sep);
        const itr = new GlobResource(resolved, '/**/*.txt', true);

        __self.assertEquals([
            resolved+sep+'TESTFILE.txt',
            resolved+sep+'Testdir'+sep+'Subdir'+sep+'another_dir'+sep+'test_file.txt',
            resolved+sep+'Testdir'+sep+'bazbaz.txt',
        ], [ ...itr ].sort());
    }
}
