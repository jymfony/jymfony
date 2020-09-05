declare namespace Jymfony.Component.Validator.Util {
    export class PropertyPath {
        private constructor();

        /**
         * Appends a path to a given property path.
         *
         * If the base path is empty, the appended path will be returned unchanged.
         * If the base path is not empty, and the appended path starts with a
         * squared opening bracket ("["), the concatenation of the two paths is
         * returned. Otherwise, the concatenation of the two paths is returned,
         * separated by a dot (".").
         *
         * @returns The concatenation of the two property paths
         */
        static append(basePath: string, subPath: string): string;
    }
}
