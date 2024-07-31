#!/usr/bin/env node

require('@jymfony/runtime');

module.exports = async function () {
    const {join} = require('path');

    const Namespace = require('@jymfony/autoloader/src/Namespace');
    global.App = new Namespace(__jymfony.autoload, 'App', [ join(__dirname, 'updater') ]);

    return new App.Application();
};
