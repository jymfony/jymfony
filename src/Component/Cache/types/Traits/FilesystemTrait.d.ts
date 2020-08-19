declare namespace Jymfony.Component.Cache.Traits {
    export class FilesystemTrait {
        public static readonly definition: Newable<FilesystemTrait>;

        prune(): Promise<boolean>;

        /**
         * @inheritdoc
         */
        protected _doFetch(ids: string[]): Promise<Record<string, any>>;

        /**
         * @inheritdoc
         */
        protected _doHave(id: string): Promise<boolean>;

        /**
         * @inheritdoc
         */
        protected _doSave(values: Record<string, any>, lifetime: number): Promise<Record<string, any> | boolean>;

        /**
         * @inheritdoc
         */
        protected _doClear(): Promise<boolean>;

        /**
         * @inheritdoc
         */
        protected _doDelete(ids: string[]): Promise<boolean>;

        private _init(namespace: string, directory: string): void;

        private _write(file: string, data: string | Buffer /* , expiresAt = undefined */): Promise<void>;

        private _getFile(id: string, mkdir?: boolean): string;
    }
}
