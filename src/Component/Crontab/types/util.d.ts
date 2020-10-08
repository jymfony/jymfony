import CompiledSchedule = Jymfony.Component.Crontab.Compiler.CompiledSchedule;
import DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;

export const NEVER: Symbol;

export function nextVal(val: number, values: number[], extent: [number, number]): number;
export function nextInvalidVal(val: number, values: number[], extent: [number, number]): number | undefined;

/**
 * Advances the schedule start date times.
 */
export function tickStarts(schedules: CompiledSchedule, starts: DateTimeInterface[], startDate: DateTimeInterface): void;

/**
 * Finds the smallest date time into the given array.
 */
export function findNext(arr: DateTimeInterface[]): DateTimeInterface | undefined;

/**
 * Updates the set of cached ranges to the next valid ranges. Only
 * schedules where the current start date is less than or equal to the
 * specified startDate need to be updated.
 *
 * @param schedules The set of schedules to use
 * @param ranges The set of start dates for the schedules
 * @param startDate Starts earlier than this date will be calculated
 */
export function updateRangeStarts(schedules: CompiledSchedule[], ranges: [DateTimeInterface, DateTimeInterface][], startDate: DateTimeInterface): void;

/**
 * Calculates the end of the overlap between any exception schedule and the
 * specified start date. Returns undefined if there is no overlap.
 *
 * @param ranges The set of cached start dates for the schedules
 * @param startDate The valid date for which the overlap will be found
 */
export function calcRangeOverlap(ranges: [DateTimeInterface, DateTimeInterface][], startDate: DateTimeInterface): DateTimeInterface;

/**
 * Updates the set of cached start dates to the next valid start dates. Only
 * schedules where the current start date is less than or equal to the
 * specified startDate need to be updated.
 *
 * @param schedules The set of schedules to use
 * @param starts The set of start dates for the schedules
 * @param startDate Starts earlier than this date will be calculated
 */
export function updateNextStarts(schedules: CompiledSchedule[], starts: DateTimeInterface[], startDate: DateTimeInterface): void;
