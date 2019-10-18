const { PassThrough } = require('stream');
const { EOL } = require('os');
const { expect } = require('chai');

const ProgressIndicator = Jymfony.Component.Console.Helper.ProgressIndicator;
const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
const StreamOutput = Jymfony.Component.Console.Output.StreamOutput;
const Terminal = Jymfony.Component.Console.Terminal;

describe('[Console] ProgressIndicator', function () {
    const getOutputStream = (decorated = true, verbosity = OutputInterface.VERBOSITY_NORMAL) => {
        const stream = new StreamOutput(new PassThrough(), verbosity, decorated);
        stream.deferUncork = false;

        return stream;
    };

    let time = 0;
    const getProgressIndicator = (output, indicatorValues = undefined) => {
        return new class extends ProgressIndicator {
            _getCurrentTimeInMilliseconds() {
                return time;
            }
        }(output, undefined, 100, indicatorValues);
    };

    const generateOutput = (expected) => {
        const count = expected.split('\n').length - 1;

        return '\x0D\x1B[2K' + (count ? __jymfony.sprintf('\x1B[%dA', count) : '') + expected;
    };

    it ('should output indicator correctly', () => {
        const output = getOutputStream();

        const bar = getProgressIndicator(output);
        bar.start('Starting...');
        time += 101;
        bar.advance();
        time += 101;
        bar.advance();
        time += 101;
        bar.advance();
        time += 101;
        bar.advance();
        time += 101;
        bar.advance();
        time += 101;
        bar.message = 'Advancing...';
        bar.advance();
        bar.finish('Done...');
        bar.start('Starting Again...');
        time += 101;
        bar.advance();
        bar.finish('Done Again...');

        const read = output.stream.read();
        if (Terminal.hasUnicodeSupport) {
            expect(read.toString()).to.be.eq(
                generateOutput(' ⠋ Starting...') +
                generateOutput(' ⠙ Starting...') +
                generateOutput(' ⠹ Starting...') +
                generateOutput(' ⠸ Starting...') +
                generateOutput(' ⠼ Starting...') +
                generateOutput(' ⠴ Starting...') +
                generateOutput(' ⠴ Advancing...') +
                generateOutput(' ⠦ Advancing...') +
                generateOutput(' ⠦ Done...') +
                EOL +
                generateOutput(' ⠋ Starting Again...') +
                generateOutput(' ⠙ Starting Again...') +
                generateOutput(' ⠙ Done Again...') +
                EOL
            );
        } else {
            expect(read.toString()).to.be.eq(
                generateOutput(' - Starting...') +
                generateOutput(' \\ Starting...') +
                generateOutput(' | Starting...') +
                generateOutput(' / Starting...') +
                generateOutput(' - Starting...') +
                generateOutput(' \\ Starting...') +
                generateOutput(' \\ Advancing...') +
                generateOutput(' | Advancing...') +
                generateOutput(' | Done...') +
                EOL +
                generateOutput(' - Starting Again...') +
                generateOutput(' \\ Starting Again...') +
                generateOutput(' \\ Done Again...') +
                EOL
            );
        }
    });

    it ('should output indicator correctly in non-interactive mode', () => {
        const output = getOutputStream(false);
        const bar = getProgressIndicator(output);

        bar.start('Starting...');
        bar.advance();
        bar.advance();
        bar.message = 'Midway...';
        bar.advance();
        bar.advance();
        bar.finish('Done...');

        const read = output.stream.read();
        expect(read.toString()).to.be.eq(
            ' Starting...' + EOL +
            ' Midway...' + EOL +
            ' Done...' + EOL + EOL
        );
    });

    it ('should output custom indicator value', () => {
        const output = getOutputStream();
        const bar = getProgressIndicator(output, [ 'a', 'b', 'c' ]);

        bar.start('Starting...');
        time += 101;
        bar.advance();
        time += 101;
        bar.advance();
        time += 101;
        bar.advance();

        const read = output.stream.read();
        expect(read.toString()).to.be.eq(
            generateOutput(' a Starting...') +
            generateOutput(' b Starting...') +
            generateOutput(' c Starting...') +
            generateOutput(' a Starting...')
        );
    });

    it ('should throw if indicator values is less than 2 characters', () => {
        expect(() => getProgressIndicator(getOutputStream(), [ '1' ])).to.throw(
            InvalidArgumentException,
            /Must have at least 2 indicator value characters\./
        );
    });

    it ('start on an already started indicator should throw', () => {
        const bar = getProgressIndicator(getOutputStream());
        bar.start('Starting...');

        expect(() => bar.start('Starting again.')).to.throw(
            LogicException,
            /Progress indicator already started\./
        );
    });

    it ('advance on a non-started indicator should throw', () => {
        const bar = getProgressIndicator(getOutputStream());

        expect(() => bar.advance()).to.throw(
            LogicException,
            /Progress indicator has not yet been started\./
        );
    });

    it ('finish on a non-started indicator should throw', () => {
        const bar = getProgressIndicator(getOutputStream());

        expect(() => bar.finish('Finished')).to.throw(
            LogicException,
            /Progress indicator has not yet been started\./
        );
    });

    for (const format of [ 'normal', 'verbose', 'very_verbose' ]) {
        it ('should output indicator with format ' + format, () => {
            const output = getOutputStream();
            const bar = new ProgressIndicator(output, format);

            bar.start('Starting...');
            bar.advance();

            expect(output.stream.read().toString()).not.to.be.empty;
        });
    }
});
