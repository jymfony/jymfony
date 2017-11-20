declare namespace Jymfony.Component.Console.Helper {
    /**
     * Defines the styles for a Table.
     */
    export class TableStyle {
        private _paddingChar: string;
        private _horizontalOutsideBorderChar: string;
        private _horizontalInsideBorderChar: string;
        private _verticalOutsideBorderChar: string;
        private _verticalInsideBorderChar: string;
        private _crossingChar: string;
        private _crossingTopRightChar: string;
        private _crossingTopMidChar: string;
        private _crossingTopLeftChar: string;
        private _crossingMidRightChar: string;
        private _crossingBottomRightChar: string;
        private _crossingBottomMidChar: string;
        private _crossingBottomLeftChar: string;
        private _crossingMidLeftChar: string;
        private _crossingTopLeftBottomChar: string;
        private _crossingTopMidBottomChar: string;
        private _crossingTopRightBottomChar: string;
        private _headerTitleFormat: string;
        private _footerTitleFormat: string;
        private _cellHeaderFormat: string;
        private _cellRowFormat: string;
        private _cellRowContentFormat: string;
        private _borderFormat: string;
        private _padType: string;

        __construct(): void;
        constructor();

        /**
         * Gets/sets padding character, used for cell padding.
         */
        public paddingChar: string;

        /**
         * Sets horizontal border characters.
         *
         * <code>
         * ╔═══════════════╤══════════════════════════╤══════════════════╗
         * 1 ISBN          2 Title                    │ Author           ║
         * ╠═══════════════╪══════════════════════════╪══════════════════╣
         * ║ 99921-58-10-7 │ Divine Comedy            │ Dante Alighieri  ║
         * ║ 9971-5-0210-0 │ A Tale of Two Cities     │ Charles Dickens  ║
         * ║ 960-425-059-0 │ The Lord of the Rings    │ J. R. R. Tolkien ║
         * ║ 80-902734-1-6 │ And Then There Were None │ Agatha Christie  ║
         * ╚═══════════════╧══════════════════════════╧══════════════════╝
         * </code>
         *
         * @param outside Outside border char (see #1 of example)
         * @param {null|string} inside  Inside border char (see #2 of example), equals outside if null
         */
        setHorizontalBorderChars(outside: string, inside?: null | string);

        /**
         * Sets vertical border characters.
         *
         * <code>
         * ╔═══════════════╤══════════════════════════╤══════════════════╗
         * ║ ISBN          │ Title                    │ Author           ║
         * ╠═══════1═══════╪══════════════════════════╪══════════════════╣
         * ║ 99921-58-10-7 │ Divine Comedy            │ Dante Alighieri  ║
         * ║ 9971-5-0210-0 │ A Tale of Two Cities     │ Charles Dickens  ║
         * ╟───────2───────┼──────────────────────────┼──────────────────╢
         * ║ 960-425-059-0 │ The Lord of the Rings    │ J. R. R. Tolkien ║
         * ║ 80-902734-1-6 │ And Then There Were None │ Agatha Christie  ║
         * ╚═══════════════╧══════════════════════════╧══════════════════╝
         * </code>
         *
         * @param outside Outside border char (see #1 of example)
         * @param {null|string} inside  Inside border char (see #2 of example), equals outside if null
         */
        setVerticalBorderChars(outside: string, inside?: null | string);

        /**
         * Gets border characters.
         *
         * @internal
         */
        public readonly borderChars: string[];

        /**
         * Sets crossing characters.
         *
         * Example:
         * <code>
         * 1═══════════════2══════════════════════════2══════════════════3
         * ║ ISBN          │ Title                    │ Author           ║
         * 8'══════════════0'═════════════════════════0'═════════════════4'
         * ║ 99921-58-10-7 │ Divine Comedy            │ Dante Alighieri  ║
         * ║ 9971-5-0210-0 │ A Tale of Two Cities     │ Charles Dickens  ║
         * 8───────────────0──────────────────────────0──────────────────4
         * ║ 960-425-059-0 │ The Lord of the Rings    │ J. R. R. Tolkien ║
         * ║ 80-902734-1-6 │ And Then There Were None │ Agatha Christie  ║
         * 7═══════════════6══════════════════════════6══════════════════5
         * </code>
         *
         * @param cross Crossing char (see #0 of example)
         * @param topLeft Top left char (see #1 of example)
         * @param topMid Top mid char (see #2 of example)
         * @param topRight Top right char (see #3 of example)
         * @param midRight Mid right char (see #4 of example)
         * @param bottomRight Bottom right char (see #5 of example)
         * @param bottomMid Bottom mid char (see #6 of example)
         * @param bottomLeft Bottom left char (see #7 of example)
         * @param midLeft Mid left char (see #8 of example)
         * @param topLeftBottom Top left bottom char (see #8' of example), equals to midLeft if null
         * @param topMidBottom Top mid bottom char (see #0' of example), equals to cross if null
         * @param topRightBottom Top right bottom char (see #4' of example), equals to midRight if null
         */
        setCrossingChars(
            cross: string,
            topLeft: string,
            topMid: string,
            topRight: string,
            midRight: string,
            bottomRight: string,
            bottomMid: string,
            bottomLeft: string,
            midLeft: string,
            topLeftBottom?: null | string,
            topMidBottom?: null | string,
            topRightBottom?: null | string
        ): void;

        /**
         * Sets default crossing character used for each cross.
         *
         * @see {@link setCrossingChars()} for setting each crossing individually.
         */
        public /* writeonly */ defaultCrossingChar: string;

        /**
         * Gets crossing character.
         */
        public readonly crossingChar: string;

        /**
         * Gets crossing characters.
         *
         * @internal
         */
        public readonly crossingChars: string[];

        /**
         * Gets/sets header cell format.
         */
        public cellHeaderFormat: string;

        /**
         * Gets/sets row cell format.
         */
        public cellRowFormat: string;

        /**
         * Gets/sets row cell content format.
         */
        public cellRowContentFormat: string;

        /**
         * Gets/sets table border format.
         */
        public borderFormat: string;

        /**
         * Gets/sets cell padding type.
         */
        public padType: 'STR_PAD_LEFT' | 'STR_PAD_RIGHT' | 'STR_PATH_BOTH';

        public headerTitleFormat: string;
        public footerTitleFormat: string;
    }
}
