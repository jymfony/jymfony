export const NEVER = Symbol('NEVER');

export function nextVal(val, values, extent) {
    const zeroIsLargest = 0 !== extent[0];
    let nextIdx = 0;

    for(let i = values.length - 1; -1 < i; --i) {
        const cur = values[i];

        if (cur === val) {
            return cur;
        }

        if (cur > val || (0 === cur && zeroIsLargest && extent[1] > val)) {
            nextIdx = i;
            continue;
        }

        break;
    }

    return values[nextIdx];
}

export function nextInvalidVal(val, values, extent) {
    const min = extent[0];
    const max = extent[1];
    const zeroVal = 0 === values[values.length - 1] && 0 !== min ? max : 0;

    let next = val;
    let i = values.indexOf(val);

    const start = next;

    while (next === (values[i] || zeroVal)) {
        next++;
        if(next > max) {
            next = min;
        }

        if (++i === values.length) {
            i = 0;
        }

        if (next === start) {
            return undefined;
        }
    }

    return next;
}

/**
 * Advances the schedule start date times.
 *
 * @param schedules
 * @param {Jymfony.Contracts.DateTime.DateTimeInterface[]} starts
 * @param {Jymfony.Contracts.DateTime.DateTimeInterface} startDate
 */
export function tickStarts (schedules, starts, startDate) {
    for (let i = 0, len = schedules.length; i < len; i++) {
        if (! starts[i]) {
            continue;
        }

        if (starts[i].timestamp === startDate.timestamp) {
            starts[i] = schedules[i].start(schedules[i].tick(startDate));
        }
    }
}

/**
 * Finds the smallest date time into the given array.
 *
 * @param {Jymfony.Component.DateTime.DateTime[]} arr
 *
 * @returns {Jymfony.Component.DateTime.DateTime|undefined}
 */
export function findNext(arr) {
    let next = arr[0];
    for (const v of arr) {
        if (v && next.timestamp > v.timestamp) {
            next = v;
        }
    }

    return next;
}


/**
 * Updates the set of cached ranges to the next valid ranges. Only
 * schedules where the current start date is less than or equal to the
 * specified startDate need to be updated.
 *
 * @param {Array} schedules The set of schedules to use
 * @param {[Jymfony.Contracts.DateTime.DateTimeInterface, Jymfony.Contracts.DateTime.DateTimeInterface][]} ranges The set of start dates for the schedules
 * @param {Jymfony.Contracts.DateTime.DateTimeInterface} startDate Starts earlier than this date will be calculated
 */
export function updateRangeStarts(schedules, ranges, startDate) {
    for (let i = 0, len = schedules.length; i < len; i++) {
        if (! ranges[i] || ranges[i][0].timestamp > startDate.timestamp) {
            continue;
        }

        const nextStart = schedules[i].start(startDate);
        ranges[i] = ! nextStart ? NEVER : [ nextStart, schedules[i].end(nextStart) ];
    }
}


/**
 * Calculates the end of the overlap between any exception schedule and the
 * specified start date. Returns undefined if there is no overlap.
 *
 * @param {[Jymfony.Contracts.DateTime.DateTimeInterface, Jymfony.Contracts.DateTime.DateTimeInterface][]} ranges The set of cached start dates for the schedules
 * @param {Jymfony.Contracts.DateTime.DateTimeInterface} startDate The valid date for which the overlap will be found
 */
export function calcRangeOverlap(ranges, startDate) {
    let result;

    for (const range of ranges) {
        if (! range || range[0].timestamp > startDate.timestamp) {
            continue;
        }

        if (range[1] && range[1] <= startDate.timestamp) {
            continue;
        }

        // StartDate is in the middle of an exception range
        if (! result || range[1].timestamp > result.timestamp) {
            result = range[1];
        }
    }

    return result;
}

/**
 * Updates the set of cached start dates to the next valid start dates. Only
 * schedules where the current start date is less than or equal to the
 * specified startDate need to be updated.
 *
 * @param {Array} schedules The set of schedules to use
 * @param {Jymfony.Contracts.DateTime.DateTimeInterface[]} starts The set of start dates for the schedules
 * @param {Jymfony.Contracts.DateTime.DateTimeInterface} startDate Starts earlier than this date will be calculated
 */
export function updateNextStarts(schedules, starts, startDate) {
    for (let i = 0, len = schedules.length; i < len; ++i) {
        if (! starts[i] || starts[i].timestamp > startDate.timestamp) {
            continue;
        }

        starts[i] = schedules[i].start(startDate);
    }
}
