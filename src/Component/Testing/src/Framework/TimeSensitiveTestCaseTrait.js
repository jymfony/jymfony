import { @afterEach, @beforeEach } from '@jymfony/decorators';

const sym = Symbol('time sensitive test case hashtable');

let kTimerHandle = 0;
class Timer {
    constructor(handler) {
        this._handler = handler;
        this._ref = true;
        this._handle = ++kTimerHandle;
    }

    ref() {
        this._ref = true;
    }

    unref() {
        this._ref = false;
    }

    hasRef() {
        return this._ref;
    }

    refresh() {
    }

    [Symbol.toPrimitive]() {
        return this._handle;
    }
}

/**
 * @memberOf Jymfony.Component.Testing.Framework
 */
class TimeSensitiveTestCaseTrait {
    __construct() {
        this[sym] = undefined;
    }

    @beforeEach()
    beforeTimeSensitiveCase() {
        const self = this;
        const dateFn = Date;

        this[sym] = {
            currentDate: new Date(),
            currentHrTime: process.hrtime(),
            currentHrTimeBigint: process.hrtime.bigint ? process.hrtime.bigint() : null,
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

                return new dateFn(self[sym].currentDate);
            }

            static [Symbol.hasInstance](other) {
                return other instanceof dateFn;
            }

            static now() {
                return self[sym].currentDate.valueOf();
            }
        };

        const mockHrtime = () => {
            return this[sym].currentHrTime;
        };

        if (this[sym].originalHrTime.bigint) {
            mockHrtime.bigint = () => {
                return this[sym].currentHrTimeBigint;
            };
        }

        setTimeout = (handler, ms) => {
            let handle;
            const timer = new Timer(() => {
                delete this[sym].timers[handle];
                return handler();
            });

            handle = Number(timer);
            this[sym].timers[handle] = { timer, on: this[sym].currentDate.valueOf() + ms };

            if (ms <= 0) {
                setImmediate(timer._handler);
            }
        };

        clearTimeout = (handle) => {
            handle = Number(handle);
            delete this[sym].timers[handle];
        };

        global.Date = mockDate;
        process.hrtime = mockHrtime;

        __jymfony.sleep = async ms => {
            const dateValue = this[sym].currentDate.valueOf() + ms;
            this[sym].currentDate = new dateFn(dateValue);

            this[sym].currentHrTime[0] += Math.floor(ms / 1000);
            this[sym].currentHrTime[1] += Math.floor(ms % 1000) * 1000000;
            if (this[sym].currentHrTime[1] > 1000000000) {
                this[sym].currentHrTime[0] += Math.floor(this[sym].currentHrTime[1] / 1000000000);
                this[sym].currentHrTime[1] %= 1000000000;
            }

            if (this[sym].currentHrTimeBigint) {
                this[sym].currentHrTimeBigint += BigInt(ms * 1000000);
            }

            for (const t of Object.values(this[sym].timers)) {
                if (t.on > dateValue) {
                    continue;
                }

                t.timer._handler();
            }
        };
    }

    @afterEach()
    afterTimeSensitiveCase() {
        global.Date = this[sym].originalDateObject;
        process.hrtime = this[sym].originalHrTime;
        __jymfony.sleep = this[sym].originalSleep;
        setTimeout = this[sym].originalSetTimeout;
        clearTimeout = this[sym].originalClearTimeout;
    }
}

export default getTrait(TimeSensitiveTestCaseTrait);
