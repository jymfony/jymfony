declare namespace Jymfony.Component.Templating.Template {
    export class JsTemplate extends implementationOf(TemplateInterface) {
        private _file: string;

        /**
         * Constructor.
         */
        __construct(file: string): void;
        constructor(file: string);

        /**
         * @inheritdoc
         */
        stream(out: AsyncFunction, parameters?: Record<string, any>): Promise<void>;
    }
}
