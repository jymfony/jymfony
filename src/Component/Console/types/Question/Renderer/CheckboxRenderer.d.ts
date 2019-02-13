declare namespace Jymfony.Component.Console.Question.Renderer {
    import Choice = Jymfony.Component.Console.Question.Choice;
    import Question = Jymfony.Component.Console.Question.Question;

    /**
     * Renders a multiselect ChoiceQuestion with checkboxes.
     *
     * This class is internal and should be considered private
     * DO NOT USE this directly.
     *
     * @internal
     */
    export class CheckboxRenderer extends ListRenderer {
        private _selected: boolean[];

        /**
         * @inheritdoc
         */
        __construct(question: Question): void;
        constructor(question: Question);

        /**
         * @inheritdoc
         */
        protected _onData(data: Buffer): void;

        /**
         * @inheritdoc
         */
        protected _getValue(): any;

        /**
         * @inheritdoc
         */
        protected _renderChoice(choice: Choice, key: number): string;

        /**
         * @param {boolean} selected
         *
         * @returns {string}
         *
         * @private
         */
        private _getCheckbox(selected: boolean): string;
    }
}
