declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class File extends Constraint {
        public static readonly NOT_FOUND_ERROR: string;
        public static readonly NOT_READABLE_ERROR: string;
        public static readonly EMPTY_ERROR: string;
        public static readonly TOO_LARGE_ERROR: string;
        public static readonly INVALID_MIME_TYPE_ERROR: string;

        public mimeTypes: string[];
        public notFoundMessage: string;
        public notReadableMessage: string;
        public maxSizeMessage: string;
        public mimeTypesMessage: string;
        public disallowEmptyMessage: string;
        public binaryFormat?: number;
        public maxSize: number;

        private _maxSize?: number;
        private _initialized: boolean;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<File>): this;
        constructor(options?: null | ConstraintOptions<File>);

        private _normalizeBinaryFormat(maxSize: number): void;
    }
}
