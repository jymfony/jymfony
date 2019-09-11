import { spawnSync } from 'child_process';

const AbstractRenderer = Jymfony.Component.Console.Question.Renderer.AbstractRenderer;
const shell_exec = (command) => {
    const obj = spawnSync(command, [], {
        shell: true,
        stdio: [
            0,
            'pipe',
            'pipe',
        ],
    });

    return obj.stdout.toString();
};

/**
 * Renders a PasswordQuestion prompt using stty to hide
 * password or echo.
 * This class is internal and should be considered private
 * DO NOT USE this directly.
 *
 * @memberOf Jymfony.Component.Console.Question.Renderer
 *
 * @internal
 */
export default class SttyPasswordRenderer extends AbstractRenderer {
    /**
     * @inheritdoc
     */
    doAsk() {
        const sttyMode = shell_exec('stty -g');

        return new Promise((resolve) => {
            shell_exec('stty -echo');

            this._output.write('[<info>?</info>] ' + this._question._question + ' ');
            let cb;
            this._input.on('data', cb = (line) => {
                line = __jymfony.rtrim(line.toString(), '\r\n');

                shell_exec('stty ' + sttyMode);
                this._input.removeListener('data', cb);
                this._input.pause();
                this._output.write('\n');

                resolve(line);
            });
        });
    }
}
