const ListRenderer = Jymfony.Component.Console.Question.Renderer.ListRenderer;

/**
 * Renders a multiselect ChoiceQuestion with checkboxes.
 *
 * This class is internal and should be considered private
 * DO NOT USE this directly.
 *
 * @internal
 * @memberOf Jymfony.Component.Console.Question.Renderer
 */
class CheckboxRenderer extends ListRenderer {
    __construct(question) {
        super.__construct(question);

        this._selected = [ ...this._question._choices ].fill(false);
    }

    _onData(data) {
        if (' ' === data.toString()) {
            this._selected[this._current] = ! this._selected[this._current];
            this._print();
        }

        return super._onData(data);
    }

    _getValue() {
        const choices = [];
        for (let key = 0; key < this._selected.length; key++) {
            if (this._selected[key]) {
                choices.push(this._question._choices[key]);
            }
        }

        return choices.map(T => T.value);
    }

    _renderChoice(choice, key) {
        return ' ' + (this._current === key ? '>' : ' ') + ' ' + this._getCheckbox(this._selected[key]) + ' ' + choice.label;
    }

    _getCheckbox(selected) {
        if (__jymfony.Platform.isWindows()) {
            return selected ? '[x]' : '[ ]';
        }

        return selected ? '◉' : '◯';
    }
}

module.exports = CheckboxRenderer;
