declare namespace Jymfony.Component.Templating.Helper {
    import View = Jymfony.Component.Templating.View.View;

    /**
     * SlotsHelper manages template slots.
     */
    export class SlotsHelper extends implementationOf(HelperInterface) {
        private _view: View;
        private _openSlots: string[];
        private _overwritingSlots: Record<string, __jymfony.StreamBuffer>;

        /**
         * Constructor.
         */
        __construct(view: View): void;
        constructor(view: View);

        /**
         * Starts a new slot.
         *
         * This method starts an output buffer that will be
         * closed when the stop() method is called.
         *
         * @throws {InvalidArgumentException} if a slot with the same name is already started
         */
        start(name: string): void;

        /**
         * Stops a slot.
         *
         * @throws {LogicException} if no slot has been started
         */
        stop(): void;

        /**
         * Returns true if the slot exists.
         */
        has(name: string): boolean;

        /**
         * Outputs a slot.
         *
         * @param name The slot name
         * @param defaultValue The default slot content
         *
         * @returns true if the slot is defined or a default value is present, false otherwise
         */
        output(name: string, defaultValue?: boolean | string): Promise<boolean>;

        /**
         * Returns the canonical name of this helper.
         *
         * @returns The canonical name
         */
        public readonly name: string;
    }
}
