export const map = function (f) {
    return (source) => {
        return f(source);
    };
};
