import * as childProcess from 'child_process';
import * as fs from 'fs';
import { promisify } from 'util';

const MimeTypeGuesserInterface = Jymfony.Component.Mime.MimeTypeGuesserInterface;

const access = promisify(fs.access);
const exec = promisify(childProcess.exec);

let supported;

/**
 * Guesses the MIME type with the binary "file" (available on *nix)
 *
 * @memberOf Jymfony.Component.Mime
 */
export default class FileBinaryMimeTypeGuesser extends implementationOf(MimeTypeGuesserInterface) {
    /**
     * Constructor.
     *
     * @param {string} cmd
     */
    __construct(cmd = 'file -b --mime %s 2> /dev/null') {
        /**
         * @type {string}
         *
         * @private
         */
        this._cmd = cmd;
    }

    /**
     * @inheritdoc
     */
    isGuesserSupported() {
        if (undefined !== supported) {
            return supported;
        }

        if (__jymfony.Platform.isWindows()) {
            return supported = false;
        }

        try {
            return supported = '' !== __jymfony.trim(childProcess.execSync('command -v file', { shell: true }).toString());
        } catch (e) {
            return supported = false;
        }
    }

    /**
     * @inheritdoc
     */
    async guessMimeType(path) {
        try {
            await access(path, fs.constants.R_OK);
        } catch (e) {
            throw new InvalidArgumentException(__jymfony.sprintf('The file "%s" does not exist or is not readable', path));
        }

        if (! this.isGuesserSupported()) {
            throw new LogicException('Binary mime type guesser not supported');
        }

        const stdout = __jymfony.trim((await exec(__jymfony.sprintf(this._cmd, __jymfony.escapeshellarg(path)), { shell: true })).stdout);
        const match = stdout.match(/^([a-z0-9\-]+\/[a-z0-9\-.]+)/i);

        if (! match) {
            // Not a type
            return null;
        }

        return match[1];
    }
}
