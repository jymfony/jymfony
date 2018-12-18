const NullLogger = Jymfony.Component.Logger.NullLogger;
const child_process = require('child_process');

/**
 * Development server.
 *
 * @memberOf Jymfony.Component.DevServer
 */
class DevServer {
    /**
     * Constructor.
     *
     * @param {string} projectDir
     * @param {Jymfony.Component.Logger.LoggerInterface} logger
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
         * @type {Jymfony.Component.Logger.LoggerInterface}
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

        const restart = __jymfony.debounce(this._restart.bind(this), 750);

        let res;
        const promise = new Promise(resolve => res = resolve);
        this._watcher = this._fs.watch(this._projectDir, {
            persistent: true,
            recursive: true,
        }, (eventType, filename) => {
            if (filename.match(/(^\.idea|^.git|^.vscode|(^|\/).DS_Store)/)) {
                return;
            }

            this._logger.debug('File changes detected. Restarting...', { eventType, filename });
            restart();
        });

        this._watcher.on('close', () => res());
        restart();

        return promise;
    }

    /**
     * Closes the subprocess and the filesystem watcher.
     */
    close() {
        if (undefined !== this._process) {
            this._process.kill('SIGTERM');
        }

        this._watcher.close();
    }

    _restart() {
        if (undefined !== this._process) {
            this._process.removeAllListeners();
            this._process.kill('SIGTERM');
        }

        const argv = [ ...this._argv ];
        const argv0 = argv.shift();

        this._process = child_process.spawn(argv0, argv, {
            detached: false,
            stdio: 'inherit',
        });

        this._process.on('exit', () => {
            this._process = undefined;
            this.close();
        });
    }
}

module.exports = DevServer;
