require('@jymfony/autoloader');

__jymfony.autoload.debug = true;

const Runner = Jymfony.Component.Testing.Framework.Runner;
new Runner().run();
