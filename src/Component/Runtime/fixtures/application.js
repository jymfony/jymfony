require('./autoload');
require('..');

const Command = Jymfony.Component.Console.Command.Command;
const Application = Jymfony.Component.Console.Application;

module.exports = async function (env) {
    const command = new Command('go');
    command.code = function (input, output) {
        output.deferUncork = false;
        output.write('OK Application ' + env.SOME_VAR);
    };

    const app = new Application();
    app.add(command);
    app.defaultCommand = 'go';

    return app;
};
