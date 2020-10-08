require('@jymfony/autoloader');

const Debug = Jymfony.Component.Debug.Debug;
const Runner = Jymfony.Component.Testing.Framework.Runner;
Debug.enable();

new Runner().run();
