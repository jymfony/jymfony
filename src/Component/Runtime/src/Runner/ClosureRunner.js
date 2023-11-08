const RunnerInterface = Jymfony.Component.Runtime.RunnerInterface;

/**
 * @memberof Jymfony.Component.Runtime.Runner
 */
export default class ClosureRunner extends implementationOf(RunnerInterface) {
    #closure;

    constructor(closure) {
        super();
        this.#closure = closure;
    }

    async run() {
        const exitStatus = await this.#closure();

        if (isString(exitStatus)) {
            process.stdout.cork();
            process.stdout.write(exitStatus);
            process.stdout.uncork();

            return 0;
        }

        if (null !== exitStatus && !isNumber(exitStatus)) {
            throw new TypeError(__jymfony.sprintf('Unexpected value of type "%s" returned, "string|int|null" expected from runtime closure.', __jymfony.get_debug_type(exitStatus)));
        }

        return exitStatus ?? 0;
    }
}
