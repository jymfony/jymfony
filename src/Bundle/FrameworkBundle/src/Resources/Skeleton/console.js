#!/usr/bin/env node

require('../src/Component/Autoloader');

const Application = Jymfony.Bundle.FrameworkBundle.Console.Application;
const ArgvInput = Jymfony.Component.Console.Input.ArgvInput;

let input = new ArgvInput();
let env = input.getParameterOption([ '--env', '-e' ], process.env.SYMFONY_ENV ? process.env.SYMFONY_ENV : 'dev');
let debug = '0' !== process.env.JYMFONY_DEBUG && ! input.hasParameterOption([ '--no-debug', '' ]) && 'prod' !== env;

let kernel = new AppKernel(env, debug);
let application = new Application(kernel);
application.run(input);
