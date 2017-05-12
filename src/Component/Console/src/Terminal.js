const os = require('os');

/**
 * @memberOf Jymfony.Component.Console
 */
class Terminal {
    static get hasANSISupport() {
        if ('win32' === os.platform()) {
            return (
                !! process.env.ANSICON ||
                'ON' === process.env.ConEmuANSI ||
                'xterm' === process.env.TERM ||
                __jymfony.version_compare(os.release(), '10.0.10586', '>=')
            );
        }

        return true;
    }

    static get hasUnicodeSupport() {
        if ('win32' === os.platform()) {
            // Now we don't have a method that returns this information reliably
            return false;
        }

        let ctype = process.env.LC_ALL || process.env.LC_CTYPE || process.env.LANG;
        return /UTF-?(8|16)$/i.test(ctype);
    }

    get width() {
        return process.env.COLUMNS || process.stdout.columns || 80;
    }

    get height() {
        return process.env.LINES || process.stdout.rows || 50;
    }
}

module.exports = Terminal;
