const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const RepeatablePassInterface = Jymfony.Component.DependencyInjection.Compiler.RepeatablePassInterface;
const InvalidArgumentException = Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 * @type {Jymfony.Component.DependencyInjection.Compiler.RepeatedPass}
 */
module.exports = class RepeatedPass extends implementationOf(CompilerPassInterface) {
    /**
     * @param {Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface[]} passes
     */
    __construct(passes) {
        for (let pass of passes) {
            if (! (pass instanceof RepeatablePassInterface)) {
                throw new InvalidArgumentException('Passes must be an array of RepeatablePassInterface.');
            }

            pass.setRepeatedPass(this);
        }

        this._passes = passes;
    }

    /**
     * @inheritDoc
     */
    process(container) {
        do {
            this._repeat = false;

            for (let pass of this._passes) {
                pass.process(container);
            }
        } while (this._repeat);
    }

    /**
     * Sets if the pass should repeat.
     */
    setRepeat() {
        this._repeat = true;
    }

    /**
     * Returns the passes.
     *
     * @returns {Jymfony.Component.DependencyInjection.Compiler.RepeatablePassInterface[]}
     */
    getPasses() {
        return this._passes;
    }
};
