import { fork, setupMaster } from 'cluster';
import { connect } from 'net';

const workers = {};

/**
 * @param {module:cluster.Worker} worker
 */
const killWorker = async worker => {
    const p = Promise.race([
        new Promise(resolve => worker.on('exit', () => {
            if (! worker.isDead()) {
                resolve();
            }
        })),
        (async () => {
            await __jymfony.sleep(2000);

            if (! worker.isDead()) {
                worker.kill('SIGKILL');
            }
        })(),
    ]);

    worker.kill();
    await p;
};

const isOpen = async port => {
    let socket;
    try {
        await new Promise((resolve, reject) => {
            socket = connect(port, '127.0.0.1', () => {
                socket.removeListener('error', reject);
                resolve(socket);
            }).on('error', reject);
        });

        return true;
    } catch (e) {
        if ('ECONNREFUSED' === e.code) {
            return false;
        }

        throw e;
    } finally {
        socket.end();
    }

};

/**
 * @memberOf Jymfony.Contracts.HttpClient.Test
 */
export default class TestHttpServer {
    __construct(port, worker) {
        this._port = port;
        this._worker = worker;
    }

    static async start(port = 8057) {
        if (workers[port]) {
            await killWorker(workers[port]);
        } else {
            process.on('exit', async () => {
                await killWorker(workers[port]);
            });
        }

        setupMaster({
            exec: __dirname + '/worker.js',
            args: [ String(port) ],
            silent: false,
        });

        const worker = fork();
        do {
            await __jymfony.sleep(50);
        } while (! await isOpen(port));

        return new __self(port, workers[port] = worker);
    }

    async stop() {
        await killWorker(this._worker);
        delete workers[this._port];
    }
}
