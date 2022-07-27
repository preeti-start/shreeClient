import q from "q";
import { AsyncStorage } from "react-native";

export const setStoreDetails = (data, key) => {
    const d = q.defer();
    AsyncStorage.setItem(key, JSON.stringify(data)).then(_ => {
        d.resolve();
    });
    return d.promise;
};

export const getStoreDetails = key => {
    const d = q.defer();
    AsyncStorage.getItem(key).then(keyDetails => {
        if (keyDetails) {
            d.resolve(JSON.parse(keyDetails));
        } else {
            d.resolve(undefined);
        }
    });
    return d.promise;
};

export const delStoreDetails = key => {
    const d = q.defer();
    AsyncStorage.removeItem(key).then(_ => {
        d.resolve();
    });
    return d.promise;
};
