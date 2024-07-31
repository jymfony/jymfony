import perfHooks from 'perf_hooks';

const sym = Symbol('time sensitive test case hashtable');
const Timer = Jymfony.Component.Testing.Framework.TimeSensitive.Timer;

/**
 * @memberOf Jymfony.Component.Testing.Framework.TimeSensitive
 */
export default class TimeSensitive {
    static install(suite) {
        const dateFn = Date;

        suite[sym] = {
            currentDate: new Date(),
            currentPerformanceNow: perfHooks.performance.now(),
            currentHrTime: process.hrtime(),
            currentHrTimeBigint: process.hrtime.bigint ? process.hrtime.bigint() : null,
            originalPerfHookPerformanceNow: perfHooks.performance.now,
            originalDateObject: dateFn,
            originalHrTime: process.hrtime,
            originalSleep: __jymfony.sleep,
            originalSetTimeout: setTimeout,
            originalClearTimeout: clearTimeout,
            timers: {},
        };

        const mockDate = class mockDate extends dateFn {
            constructor(input) {
                super();
                if (undefined !== input) {
                    return new dateFn(input);
                }

                return new dateFn(suite[sym].currentDate);
            }

            static [Symbol.hasInstance](other) {
                return other instanceof dateFn;
            }

            static now() {
                return suite[sym].currentDate.valueOf();
            }
        };

        const mockHrtime = () => {
            return suite[sym].currentHrTime;
        };

        if (suite[sym].originalHrTime.bigint) {
            mockHrtime.bigint = () => {
                return suite[sym].currentHrTimeBigint;
            };
        }

        setTimeout = (handler, ms) => {
            let handle; // eslint-disable-line
            const timer = new Timer(() => {
                delete suite[sym].timers[handle];
                return handler();
            });

            handle = Number(timer);
            suite[sym].timers[handle] = { timer, on: suite[sym].currentDate.valueOf() + ms };

            if (0 >= ms) {
                setImmediate(timer._handler);
            }

            return timer;
        };

        clearTimeout = (handle) => {
            handle = Number(handle);
            delete suite[sym].timers[handle];
        };

        global.Date = mockDate;
        process.hrtime = mockHrtime;
        perfHooks.performance.now = () => suite[sym].currentPerformanceNow;

        __jymfony.sleep = async ms => {
            const dateValue = suite[sym].currentDate.valueOf() + ms;
            suite[sym].currentDate = new dateFn(dateValue);
            suite[sym].currentPerformanceNow += ms;

            suite[sym].currentHrTime[0] += Math.floor(ms / 1000);
            suite[sym].currentHrTime[1] += Math.floor(ms % 1000) * 1000000;
            if (1000000000 < suite[sym].currentHrTime[1]) {
                suite[sym].currentHrTime[0] += Math.floor(suite[sym].currentHrTime[1] / 1000000000);
                suite[sym].currentHrTime[1] %= 1000000000;
            }

            if (suite[sym].currentHrTimeBigint) {
                suite[sym].currentHrTimeBigint += BigInt(ms * 1000000);
            }

            for (const t of Object.values(suite[sym].timers)) {
                if (t.on > dateValue) {
                    continue;
                }

                t.timer._handler();
            }
        };
    }

    static uninstall(suite) {
        global.Date = suite[sym].originalDateObject;
        process.hrtime = suite[sym].originalHrTime;
        __jymfony.sleep = suite[sym].originalSleep;
        setTimeout = suite[sym].originalSetTimeout;
        clearTimeout = suite[sym].originalClearTimeout;
        perfHooks.performance.now = suite[sym].originalPerfHookPerformanceNow;
    }
}
