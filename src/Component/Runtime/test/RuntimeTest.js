import * as child_process from 'node:child_process';

const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class RuntimeTest extends TestCase {
    @dataProvider('provideFiles')
    testRuntime(expected, filename, env) {
        const output = child_process.execFileSync(process.argv0, [
            __dirname + '/../fixtures/' + filename,
        ], {
            env: { ...process.env, ...env },
            stdio: 'pipe',
        });

        __self.assertEquals(expected, output.toString());
    }

    * provideFiles() {
        yield [ 'OK Application test', 'application.js', { SOME_VAR: 'test' } ];
    }
}
