require('@jymfony/autoloader');

const Debug = Jymfony.Component.Debug.Debug;
const Runner = Jymfony.Component.Testing.Framework.Runner;
Debug.enable();

const [ , , ...argv ] = [ ...process.argv ];
if (0 === argv.length) {
    argv.push('test/**/*.js');
}

process.argv = argv;
new Runner().run();
