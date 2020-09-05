process.env.DEBUG = '1';
require('./src/Component/Autoloader');

const Debug = Jymfony.Component.Debug.Debug;
const Runner = Jymfony.Component.Testing.Framework.Runner;
Debug.enable();

let [ , , ...argv ] = [ ...process.argv ];

if (0 === argv.length) {
    argv.push('src/*/test/**/*.js', 'src/{Component,Bundle}/*/test/**/*.js');
} else {
    const convert = string => string
        .replace(/-/g, ' ')
        .replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, $1 => $1.toUpperCase())
        .replace(/ /g, '');

    for (const i in argv) {
        if (-1 !== argv[i].indexOf('/') || -1 !== argv[i].indexOf('\\')) {
            continue;
        }

        let name = convert(argv[i]);
        if ('Util' === name) {
            name = name.toLowerCase();
        }

        argv.splice(~~i, 1, 'src/' + name + '/test/**/*.js" "src/{Component,Bundle}/' + name + '/test/**/*.js');
    }

    argv = argv.join('" "').split(/"\s+"/g);
}

process.argv = argv;

new Runner().run();
