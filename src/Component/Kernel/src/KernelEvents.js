/**
 * Contains all events dispatched by a Kernel.
 *
 * @memberOf Jymfony.Component.Kernel
 * @final
 */
export default class KernelEvents {
}

/**
 * The UNHANDLED_REJECTION event occurs when an unhandled promise rejection appears.
 *
 * This event allows you to deal with the exception/error or
 * to modify the thrown exception.
 *
 * @type {string}
 */
KernelEvents.UNHANDLED_REJECTION = 'kernel.unhandled_rejection';
