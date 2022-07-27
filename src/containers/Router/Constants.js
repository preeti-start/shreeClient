let lastPath = undefined;

export const getLastPath = () => lastPath;
export const setLastPath = path => {
    lastPath = path;
};