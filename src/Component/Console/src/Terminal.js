const os = require('os');
const child_process = require('child_process');

/**
 * @memberOf Jymfony.Component.Console
 */
class Terminal {
    /**
     * @returns {boolean}
     */
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

    /**
     * @returns {boolean}
     */
    static get hasUnicodeSupport() {
        if ('win32' === os.platform()) {
            // Now we don't have a method that returns this information reliably
            return false;
        }

        const ctype = process.env.LC_ALL || process.env.LC_CTYPE || process.env.LANG;
        return /UTF-?(8|16)$/i.test(ctype);
    }

    static disableStty() {
        Terminal.stty = false;
    }

    /**
     * @returns {boolean}
     */
    static hasSttyAvailable() {
        if (undefined !== Terminal.stty) {
            return Terminal.stty;
        }

        Terminal.resetStty();
        return Terminal.stty;
    }

    static resetStty() {
        const obj = child_process.spawnSync('stty', [], {
            shell: true,
            stdio: [
                0,
                'pipe',
                'pipe',
            ],
        });

        return Terminal.stty = 0 === obj.status;
    }

    /**
     * @returns {int}
     */
    get width() {
        return process.env.COLUMNS || process.stdout.columns || 80;
    }

    /**
     * @returns {int}
     */
    get height() {
        return process.env.LINES || process.stdout.rows || 50;
    }
}

Terminal.stty = undefined;

module.exports = Terminal;
