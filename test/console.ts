#!/usr/bin/env node

/// <reference path="../index.d.ts" />

require('../src/Component/Autoloader');

const ArgvInput = Jymfony.Component.Console.Input.ArgvInput;
const Kernel = Jymfony.Component.Kernel.Kernel;

const input = new ArgvInput();
const env = input.getParameterOption([ '--env', '-e' ], process.env.APP_ENV ? process.env.APP_ENV : 'dev');
const debug = '0' !== process.env.APP_DEBUG && ! input.hasParameterOption([ '--no-debug', '' ]) && 'prod' !== env;

const kernel = new class extends Kernel {
    * registerBundles() {
        yield new Jymfony.Bundle.FrameworkBundle.FrameworkBundle();
    }
}(env, debug);

kernel.boot()
    .then(() => {
        const application = kernel.container.get('console.application') as Jymfony.Component.Console.Application;

        return application.run(input);
    }).catch((e) => {
        console.error(e.toString());
    });
