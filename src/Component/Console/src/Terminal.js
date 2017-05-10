/**
 * @memberOf Jymfony.Component.Console
 */
class Terminal {
    get width() {
        return process.env.COLUMNS || process.stdout.columns || 80;
    }

    get height() {
        return process.env.LINES || process.stdout.rows || 50;
    }
}

module.exports = Terminal;
