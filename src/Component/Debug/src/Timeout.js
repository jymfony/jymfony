let pendingTimeouts = [];

/**
 * @memberOf Jymfony.Component.Debug
 */
export default class Timeout {
    static enable() {
        const set = setTimeout;
        const clear = clearTimeout;

        global.setTimeout = function (callback, ms, ...args) {
            const stack = (new Exception()).stackTrace;

            const element = [ undefined, callback, ms, args, stack ];
            pendingTimeouts.push(element);

            element[0] = set(function (...callbackArgs) {
                try {
                    return callback.bind(this)(...callbackArgs);
                } finally {
                    const index = pendingTimeouts.indexOf(element);
                    __assert(-1 !== index);
                    pendingTimeouts.splice(index, 1);
                }
            }, ms, ...args);

            return element[0];
        };

        global.clearTimeout = function (handle) {
            const index = pendingTimeouts.findIndex(([ h ]) => h === handle);
            if (-1 !== index) {
                pendingTimeouts.splice(index, 1);
            }

            return clear(handle);
        };

        process.on('exit', () => {
            if (pendingTimeouts.length) {
                console.warn(__jymfony.sprintf('Exited with %u pending timeouts', pendingTimeouts.length));
                pendingTimeouts = [];
            }
        });
    }
}
