export default class CascadingEntity {
    scalar;
    requiredChild;
    optionalChild;

    static staticChild;

    /**
     * @type {CascadedChild[]}
     */
    children;
}
