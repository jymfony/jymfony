const AbstractRenderer = Jymfony.Component.Console.Question.Renderer.AbstractRenderer;
const readline = require('readline');

/**
 * Renders a Question prompt using readline.
 *
 * This class is internal and should be considered private
 * DO NOT USE this directly.
 *
 * @internal
 * @memberOf Jymfony.Component.Console.Question.Renderer
 */
class ReadlineRenderer extends AbstractRenderer {
    /**
     * @inheritDoc
     */
    doAsk() {
        const rl = readline.createInterface({
            input: this._input,
            output: this._output.stream,
            prompt: this._outputFormatter.format('[<info>?</info>] ' + this._question._question + ' '),
            completer: (line) => {
                const hits = this._question._autocompleteValues.filter(c => c.startsWith(line));

                return [ hits.length ? hits : this._question._autocompleteValues, line ];
            },
        });

        return new Promise((resolve) => {
            rl.prompt(true);

            rl.on('line', (line) => {
                rl.close();
                resolve(line);
            });
        });
    }
}

module.exports = ReadlineRenderer;
