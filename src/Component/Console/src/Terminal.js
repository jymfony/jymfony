const os = require('os');
const child_process = require("child_process");

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

    static disableStty() {
        Terminal.stty = false;
    }

    static hasSttyAvailable() {
        if (undefined !== Terminal.stty) {
            return Terminal.stty;
        }

        Terminal.resetStty();
        return Terminal.stty;
    }

    static resetStty() {
        let obj = child_process.spawnSync('stty', [], {
            shell: true,
            stdio: [
                0,
                'pipe',
                'pipe',
            ],
        });

        return Terminal.stty = 0 === obj.status;
    }

    get width() {
        return process.env.COLUMNS || process.stdout.columns || 80;
    }

    get height() {
        return process.env.LINES || process.stdout.rows || 50;
    }
}

Terminal.stty = undefined;

module.exports = Terminal;
