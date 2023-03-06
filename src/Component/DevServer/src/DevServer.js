import { spawn } from 'child_process';
import { watch } from 'chokidar' optional;
const NullLogger = Jymfony.Contracts.Logger.NullLogger;

const IGNORED_PATHS = /(^\.idea\/|^\.git|^node_modules\/|^\.vscode\/|(^|\/).DS_Store\/)/

/**
 * Development server.
 *
 * @memberOf Jymfony.Component.DevServer
 */
export default class DevServer {
    /**
     * Constructor.
     *
     * @param {string} projectDir
     * @param {Jymfony.Contracts.Logger.LoggerInterface} logger
     * @param {module:fs} fs
     */
    __construct(projectDir, logger = undefined, fs = require('fs')) {
        /**
         * @type {string}
         *
         * @private
         */
        this._projectDir = projectDir;

        /**
         * @type {Jymfony.Contracts.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = logger || new NullLogger();

        /**
         * @type {module:fs}
         *
         * @private
         */
        this._fs = fs;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._argv = [];

        /**
         * @type {undefined|ChildProcess}
         *
         * @private
         */
        this._process = undefined;

        /**
         * @type {FSWatcher}
         *
         * @private
         */
        this._watcher = undefined;
    }

    /**
     * Runs the dev server, watching the files and re-starting the process on changes.
     *
     * @param argv
     *
     * @returns {Promise<void>}
     */
    run(argv = []) {
        this._argv = [ ...argv ];
        const restart = __jymfony.debounce(this._restart.bind(this), 100);

        let res;
        const promise = new Promise(resolve => res = resolve);
        const handler = (eventType, filename) => {
            if (filename.match(IGNORED_PATHS)) {
                return;
            }

            this._logger.debug('File changes detected. Restarting...', { eventType, filename });
            restart();
        };

        if (watch !== undefined) {
            this._watcher = watch(this._projectDir, {
                persistent: true,
                ignored: IGNORED_PATHS,
                cwd: process.cwd(),
                usePolling: false,
            });

            this._watcher.once('ready', () => {
                this._watcher.on('all', handler);
            });
        } else {
            this._watcher = this._fs.watch(this._projectDir, {
                persistent: true,
                recursive: true,
            }, handler);
        }

        this._watcher.once('close', () => res());
        restart();

        return promise;
    }

    /**
     * Closes the subprocess and the filesystem watcher.
     */
    async close() {
        if (undefined !== this._process) {
            this._process.kill('SIGTERM');
        }

        await this._watcher.close();
        this._watcher.emit('close')
    }

    async _restart() {
        if (undefined !== this._process) {
            this._process.removeAllListeners();
            await new Promise(resolve => {
                this._process.on('exit', resolve);
                this._process.kill('SIGTERM');
            });
        }

        const argv = [ ...this._argv ];
        const argv0 = argv.shift();

        this._process = spawn(argv0, argv, {
            detached: false,
            stdio: 'inherit',
        });

        this._process.on('exit', async () => {
            this._process = undefined;
            await this.close();
        });
    }
}
