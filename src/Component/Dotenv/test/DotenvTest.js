const { mkdtempSync, rmdirSync, unlinkSync, writeFileSync } = require('fs');
const { expect } = require('chai');
const { randomBytes } = require('crypto');

const Dotenv = Jymfony.Component.Dotenv.Dotenv;
const FormatException = Jymfony.Component.Dotenv.Exception.FormatException;
const PathException = Jymfony.Component.Dotenv.Exception.PathException;

describe('[Dotenv] Dotenv', function () {
    let i = 0;
    const getEnvDataWithFormatErrors = function * () {
        const tests = [
            [ 'FOO=BAR BAZ', 'A value containing spaces must be surrounded by quotes in ".env" at line 1.\n...FOO=BAR BAZ...\n             ^ line 1 offset 11' ],
            [ 'FOO BAR=BAR', 'Whitespace characters are not supported after the variable name in ".env" at line 1.\n...FOO BAR=BAR...\n     ^ line 1 offset 3' ],
            [ 'FOO', 'Missing = in the environment variable declaration in ".env" at line 1.\n...FOO...\n     ^ line 1 offset 3' ],
            [ 'FOO="foo', 'Missing quote to end the value in ".env" at line 1.\n...FOO="foo...\n          ^ line 1 offset 8' ],
            [ 'FOO=\'foo', 'Missing quote to end the value in ".env" at line 1.\n...FOO=\'foo...\n          ^ line 1 offset 8' ],
            [ 'FOO="foo\nBAR="bar"', 'Missing quote to end the value in ".env" at line 1.\n...FOO="foo\\nBAR="bar"...\n                     ^ line 1 offset 18' ],
            [ 'FOO=\'foo\n', 'Missing quote to end the value in ".env" at line 1.\n...FOO=\'foo\\n...\n            ^ line 1 offset 9' ],
            [ 'export FOO', 'Unable to unset an environment variable in ".env" at line 1.\n...export FOO...\n            ^ line 1 offset 10' ],
            [ 'FOO=${FOO', 'Unclosed braces on variable expansion in ".env" at line 1.\n...FOO=\${FOO...\n           ^ line 1 offset 9' ],
            [ 'FOO= BAR', 'Whitespace are not supported before the value in ".env" at line 1.\n...FOO= BAR...\n      ^ line 1 offset 4' ],
            [ 'Стасян', 'Invalid character in variable name in ".env" at line 1.\n...Стасян...\n  ^ line 1 offset 0' ],
            [ 'FOO!', 'Missing = in the environment variable declaration in ".env" at line 1.\n...FOO!...\n     ^ line 1 offset 3' ],
            [ 'FOO=$(echo foo', 'Missing closing parenthesis. in ".env" at line 1.\n...FOO=$(echo foo...\n                ^ line 1 offset 14' ],
            [ 'FOO=$(echo foo\n', 'Missing closing parenthesis. in ".env" at line 1.\n...FOO=$(echo foo\\n...\n                ^ line 1 offset 14' ],
            [ 'FOO=\nBAR=\${FOO:-\\\'a{a}a}', 'Unsupported character "\'" found in the default value of variable "\$FOO". in ".env" at line 2.\n...\\nBAR=\${FOO:-\\\'a{a}a}...\n                       ^ line 2 offset 24' ],
            [ 'FOO=\nBAR=\${FOO:-a\$a}', 'Unsupported character "\$" found in the default value of variable "\$FOO". in ".env" at line 2.\n...FOO=\\nBAR=\${FOO:-a\$a}...\n                       ^ line 2 offset 20' ],
            [ 'FOO=\nBAR=\${FOO:-a"a}', 'Unclosed braces on variable expansion in ".env" at line 2.\n...FOO=\\nBAR=\${FOO:-a"a}...\n                    ^ line 2 offset 17' ],
        ];

        // If (__jymfony.Platform.isWindows()) {
        //     Tests.push([ 'FOO=$((1dd2))', 'Issue expanding a command (%s\n) in ".env" at line 1.\n...FOO=$((1dd2))...\n               ^ line 1 offset 13' ]);
        // }

        yield * tests;
    };

    for (const [ data, error ] of getEnvDataWithFormatErrors()) {
        const j = ++i;
        it('should parse with format error #' + j, () => {
            const dotenv = new Dotenv();
            expect(() => dotenv.parse(data)).to.throw(FormatException, error);
        });
    }

    const getEnvData = function * () {
        process.env.LOCAL = 'local';
        process.env.REMOTE = 'remote';
        process.env.SERVERVAR = 'servervar';

        const tests = [
            // Backslashes
            [ 'FOO=foo\\\\bar', {'FOO': 'foo\\bar'} ],
            [ 'FOO=\'foo\\\\bar\'', {'FOO': 'foo\\\\bar'} ],
            [ 'FOO="foo\\\\bar"', {'FOO': 'foo\\bar'} ],

            // Escaped backslash in front of variable
            [ 'BAR=bar\nFOO=foo\\\\\$BAR', {'BAR': 'bar', 'FOO': 'foo\\bar'} ],
            [ 'BAR=bar\nFOO=\'foo\\\\\$BAR\'', {'BAR': 'bar', 'FOO': 'foo\\\\$BAR'} ],
            [ 'BAR=bar\nFOO="foo\\\\\$BAR"', {'BAR': 'bar', 'FOO': 'foo\\bar'} ],

            [ 'FOO=foo\\\\\\$BAR', {'FOO': 'foo\\$BAR'} ],
            [ 'FOO=\'foo\\\\\\$BAR\'', {'FOO': 'foo\\\\\\$BAR'} ],
            [ 'FOO="foo\\\\\\$BAR"', {'FOO': 'foo\\$BAR'} ],

            // Spaces
            [ 'FOO=bar', {'FOO': 'bar'} ],
            [ ' FOO=bar ', {'FOO': 'bar'} ],
            [ 'FOO=', {'FOO': ''} ],
            [ 'FOO=\n\n\nBAR=bar', {'FOO': '', 'BAR': 'bar'} ],
            [ 'FOO=  ', {'FOO': ''} ],
            [ 'FOO=\nBAR=bar', {'FOO': '', 'BAR': 'bar'} ],

            // Newlines
            [ '\n\nFOO=bar\r\n\n', {'FOO': 'bar'} ],
            [ 'FOO=bar\r\nBAR=foo', {'FOO': 'bar', 'BAR': 'foo'} ],
            [ 'FOO=bar\rBAR=foo', {'FOO': 'bar', 'BAR': 'foo'} ],
            [ 'FOO=bar\nBAR=foo', {'FOO': 'bar', 'BAR': 'foo'} ],

            // Quotes
            [ 'FOO="bar"\n', {'FOO': 'bar'} ],
            [ 'FOO="bar\'foo"\n', {'FOO': 'bar\'foo'} ],
            [ 'FOO=\'bar\'\n', {'FOO': 'bar'} ],
            [ 'FOO=\'bar"foo\'\n', {'FOO': 'bar"foo'} ],
            [ 'FOO="bar\\"foo"\n', {'FOO': 'bar"foo'} ],
            [ 'FOO="bar\\nfoo"', {'FOO': 'bar\nfoo'} ],
            [ 'FOO="bar\\rfoo"', {'FOO': 'bar\rfoo'} ],
            [ 'FOO=\'bar\\nfoo\'', {'FOO': 'bar\\nfoo'} ],
            [ 'FOO=\'bar\\rfoo\'', {'FOO': 'bar\\rfoo'} ],
            [ 'FOO=\'bar\nfoo\'', {'FOO': 'bar\nfoo'} ],
            [ 'FOO=" FOO "', {'FOO': ' FOO '} ],
            [ 'FOO="  "', {'FOO': '  '} ],
            [ 'PATH="c:\\\\"', {'PATH': 'c:\\'} ],
            [ 'FOO="bar\nfoo"', {'FOO': 'bar\nfoo'} ],
            [ 'FOO=BAR\\"', {'FOO': 'BAR"'} ],
            [ 'FOO=BAR\\\'BAZ', {'FOO': 'BAR\'BAZ'} ],
            [ 'FOO=\\"BAR', {'FOO': '"BAR'} ],

            // Concatenated values
            [ 'FOO=\'bar\'\'foo\'\n', {'FOO': 'barfoo'} ],
            [ 'FOO=\'bar \'\' baz\'', {'FOO': 'bar  baz'} ],
            [ 'FOO=bar\nBAR=\'baz\'"\$FOO"', {'FOO': 'bar', 'BAR': 'bazbar'} ],
            [ 'FOO=\'bar \'\\\'\' baz\'', {'FOO': 'bar \' baz'} ],

            // Comments
            [ '#FOO=bar\nBAR=foo', {'BAR': 'foo'} ],
            [ '#FOO=bar # Comment\nBAR=foo', {'BAR': 'foo'} ],
            [ 'FOO=\'bar foo\' # Comment', {'FOO': 'bar foo'} ],
            [ 'FOO=\'bar#foo\' # Comment', {'FOO': 'bar#foo'} ],
            [ '# Comment\r\nFOO=bar\n# Comment\nBAR=foo', {'FOO': 'bar', 'BAR': 'foo'} ],
            [ 'FOO=bar # Another comment\nBAR=foo', {'FOO': 'bar', 'BAR': 'foo'} ],
            [ 'FOO=\n\n# comment\nBAR=bar', {'FOO': '', 'BAR': 'bar'} ],
            [ 'FOO=NOT#COMMENT', {'FOO': 'NOT#COMMENT'} ],
            [ 'FOO=  # Comment', {'FOO': ''} ],

            // Edge cases (no conversions, only strings as values)
            [ 'FOO=0', {'FOO': '0'} ],
            [ 'FOO=false', {'FOO': 'false'} ],
            [ 'FOO=null', {'FOO': 'null'} ],

            // Export
            [ 'export FOO=bar', {'FOO': 'bar'} ],
            [ '  export   FOO=bar', {'FOO': 'bar'} ],

            // Variable expansion
            [ 'FOO=BAR\nBAR=\$FOO', {'FOO': 'BAR', 'BAR': 'BAR'} ],
            [ 'FOO=BAR\nBAR="\$FOO"', {'FOO': 'BAR', 'BAR': 'BAR'} ],
            [ 'FOO=BAR\nBAR=\'\$FOO\'', {'FOO': 'BAR', 'BAR': '$FOO'} ],
            [ 'FOO_BAR9=BAR\nBAR=\$FOO_BAR9', {'FOO_BAR9': 'BAR', 'BAR': 'BAR'} ],
            [ 'FOO=BAR\nBAR=\${FOO}Z', {'FOO': 'BAR', 'BAR': 'BARZ'} ],
            [ 'FOO=BAR\nBAR=\$FOO}', {'FOO': 'BAR', 'BAR': 'BAR}'} ],
            [ 'FOO=BAR\nBAR=\\\$FOO', {'FOO': 'BAR', 'BAR': '$FOO'} ],
            [ 'FOO=" \\$ "', {'FOO': ' $ '} ],
            [ 'FOO=" $ "', {'FOO': ' $ '} ],
            [ 'BAR=$LOCAL', {'BAR': 'local'} ],
            [ 'BAR=$REMOTE', {'BAR': 'remote'} ],
            [ 'BAR=$SERVERVAR', {'BAR': 'servervar'} ],
            [ 'FOO=$NOTDEFINED', {'FOO': ''} ],
            [ 'FOO=BAR\nBAR=\${FOO:-TEST}', {'FOO': 'BAR', 'BAR': 'BAR'} ],
            [ 'FOO=BAR\nBAR=\${NOTDEFINED:-TEST}', {'FOO': 'BAR', 'BAR': 'TEST'} ],
            [ 'FOO=\nBAR=\${FOO:-TEST}', {'FOO': '', 'BAR': 'TEST'} ],
            [ 'FOO=\nBAR=\$FOO:-TEST}', {'FOO': '', 'BAR': 'TEST}'} ],
            [ 'FOO=BAR\nBAR=\${FOO:=TEST}', {'FOO': 'BAR', 'BAR': 'BAR'} ],
            [ 'FOO=BAR\nBAR=\${NOTDEFINED:=TEST}', {'FOO': 'BAR', 'NOTDEFINED': 'TEST', 'BAR': 'TEST'} ],
            [ 'FOO=\nBAR=\${FOO:=TEST}', {'FOO': 'TEST', 'BAR': 'TEST'} ],
            [ 'FOO=\nBAR=\$FOO:=TEST}', {'FOO': 'TEST', 'BAR': 'TEST}'} ],
            [ 'FOO=foo\nFOOBAR=\${FOO}\${BAR}', {'FOO': 'foo', 'FOOBAR': 'foo'} ],
        ];

        // If (! __jymfony.Platform.isWindows()) {
        //     Tests.push(
        //         // command expansion
        //         ['FOO=$(echo foo)', {'FOO': 'foo'}],
        //         ['FOO=$((1+2))', {'FOO': '3'}],
        //         ['FOO=FOO$((1+2))BAR', {'FOO': 'FOO3BAR'}],
        //         ['FOO=$(echo "$(echo "$(echo "$(echo foo)")")")', {'FOO': 'foo'}],
        //         ["FOO=$(echo \"Quotes won't be a problem\")", {'FOO': 'Quotes won\'t be a problem'}],
        //         ["FOO=bar\nBAR=$(echo \"FOO is \$FOO\")", {'FOO': 'bar', 'BAR': 'FOO is bar'}],
        //     );
        // }

        yield * tests;
    };

    i = 0;
    for (const [ data, expected ] of getEnvData()) {
        const j = ++i;
        it ('should parse correctly #' + j, () => {
            const dotenv = new Dotenv();
            expect(dotenv.parse(data)).to.be.deep.equal(expected);
        });
    }


    it ('load should work', () => {
        delete process.env.FOO;
        delete process.env.BAR;

        const tmpDir = mkdtempSync('jf-dotenv');

        const path1 = tmpDir + '/jf-' + randomBytes(4).readUInt32LE(0);
        const path2 = tmpDir + '/jf-' + randomBytes(4).readUInt32LE(0);

        writeFileSync(path1, 'FOO=BAR');
        writeFileSync(path2, 'BAR=BAZ');

        (new Dotenv()).load(path1, path2);

        const foo = process.env.FOO;
        const bar = process.env.BAR;

        delete process.env.FOO;
        delete process.env.BAR;

        unlinkSync(path1);
        unlinkSync(path2);
        rmdirSync(tmpDir);

        expect(foo).to.be.equal('BAR');
        expect(bar).to.be.equal('BAZ');
    });

    it ('loadEnv should work', () => {
        delete process.env.FOO;
        delete process.env.BAR;

        const tmpDir = mkdtempSync('jf-dotenv');
        const path = tmpDir + '/jf-' + randomBytes(4).readUInt32LE(0);

        // .env

        writeFileSync(path, 'FOO=BAR');
        (new Dotenv()).loadEnv(path, 'TEST_APP_ENV');
        expect(process.env.FOO).to.be.equal('BAR');
        expect(process.env.TEST_APP_ENV).to.be.equal('dev');

        // .env.local

        process.env.TEST_APP_ENV = 'local';
        writeFileSync(path + '.local', 'FOO=localBAR');
        (new Dotenv()).loadEnv(path, 'TEST_APP_ENV');
        expect(process.env.FOO).to.be.equal('localBAR');

        // Special case for test

        process.env.TEST_APP_ENV = 'test';
        (new Dotenv()).loadEnv(path, 'TEST_APP_ENV');
        expect(process.env.FOO).to.be.equal('BAR');

        // .env.dev

        delete process.env.TEST_APP_ENV;
        writeFileSync(path + '.dev', 'FOO=devBAR');
        (new Dotenv()).loadEnv(path, 'TEST_APP_ENV');
        expect(process.env.FOO).to.be.equal('devBAR');

        // .env.dev.local

        writeFileSync(path + '.dev.local', 'FOO=devlocalBAR');
        (new Dotenv()).loadEnv(path, 'TEST_APP_ENV');
        expect(process.env.FOO).to.be.equal('devlocalBAR');

        // .env.dist

        unlinkSync(path);
        writeFileSync(path + '.dist', 'BAR=distBAR');
        (new Dotenv()).loadEnv(path, 'TEST_APP_ENV');
        expect(process.env.BAR).to.be.equal('distBAR');

        delete process.env.FOO;
        delete process.env.BAR;

        unlinkSync(path + '.dist');
        unlinkSync(path + '.local');
        unlinkSync(path + '.dev');
        unlinkSync(path + '.dev.local');
        rmdirSync(tmpDir);
    });

    it ('overload should work properly', () => {
        process.env.FOO = 'initial_foo_value';
        process.env.BAR = 'initial_bar_value';

        const tmpDir = mkdtempSync('jf-dotenv');
        const path1 = tmpDir + '/jf-' + randomBytes(4).readUInt32LE(0);
        const path2 = tmpDir + '/jf-' + randomBytes(4).readUInt32LE(0);

        writeFileSync(path1, 'FOO=BAR');
        writeFileSync(path2, 'BAR=BAZ');

        (new Dotenv()).overload(path1, path2);

        const foo = process.env.FOO;
        const bar = process.env.BAR;

        delete process.env.FOO;
        delete process.env.BAR;

        unlinkSync(path1);
        unlinkSync(path2);
        rmdirSync(tmpDir);

        expect(foo).to.be.equal('BAR');
        expect(bar).to.be.equal('BAZ');
    });

    it ('trying to load non-file should throw', () => {
        const dotenv = new Dotenv();
        expect(() => dotenv.load(__dirname)).to.throw(PathException);
    });

    it ('should memorize loaded var names in special var', () => {
        // Special variable not exists
        delete process.env.JYMFONY_DOTENV_VARS;
        delete process.env.APP_DEBUG;
        delete process.env.DATABASE_URL;

        let dotenv = new Dotenv();
        dotenv.populate({ APP_DEBUG: '1', DATABASE_URL: 'mysql://root@localhost/db' });

        expect(process.env.JYMFONY_DOTENV_VARS).to.be.equal('APP_DEBUG,DATABASE_URL');

        // Special variable has a value
        process.env.JYMFONY_DOTENV_VARS = 'APP_ENV';
        process.env.APP_DEBUG = '1';

        delete process.env.DATABASE_URL;

        dotenv = new Dotenv();
        dotenv.populate({ APP_DEBUG: '0', DATABASE_URL: 'mysql://root@localhost/db' });
        dotenv.populate({ DATABASE_URL: 'sqlite:///somedb.sqlite' });

        expect(process.env.JYMFONY_DOTENV_VARS).to.be.equal('APP_ENV,DATABASE_URL');
    });

    it ('should get variables from env first', () => {
        delete process.env.JYMFONY_DOTENV_VARS;

        process.env.APP_ENV = 'prod';
        const dotenv = new Dotenv();

        const test = 'APP_ENV=dev\nTEST1=foo1_\${APP_ENV}';
        const values = dotenv.parse(test);

        expect(values.TEST1).to.be.equal('foo1_prod');
    });

    it ('bootEnv should work', () => {
        const tmpDir = mkdtempSync('jf-dotenv');
        const path = tmpDir + '/jf-' + randomBytes(4).readUInt32LE(0);

        writeFileSync(path, 'FOO=BAR');
        (new Dotenv('TEST_APP_ENV', 'TEST_APP_DEBUG')).bootEnv(path);

        expect(process.env.FOO).to.be.equal('BAR');

        delete process.env.FOO;
        unlinkSync(path);

        writeFileSync(path + '.local.js', 'export default { TEST_APP_ENV: "dev", FOO: "BAR" };');
        (new Dotenv('TEST_APP_ENV', 'TEST_APP_DEBUG')).bootEnv(path);

        expect(process.env.FOO).to.be.equal('BAR');
        expect(process.env.TEST_APP_DEBUG).to.be.equal('1');

        delete process.env.FOO;
        unlinkSync(path + '.local.js');
        rmdirSync(tmpDir);
    });
});
