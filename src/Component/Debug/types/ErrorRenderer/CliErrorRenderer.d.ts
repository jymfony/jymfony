declare namespace Jymfony.Component.Debug.ErrorRenderer {
    import FlattenException = Jymfony.Component.Debug.Exception.FlattenException;

    export class CliErrorRenderer extends implementationOf(ErrorRendererInterface) {
        /**
         * @inheritdoc
         */
        render(exception: Error): FlattenException;
    }
}
