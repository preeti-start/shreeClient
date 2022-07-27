import { updateLoadingStatus } from '../actions/userActions';
import { getDataFromServer, uploadImagesToAWS } from '../../utils/functions';
import { serverURL } from '../../constants';


const middlewares = ((store = {}) => {
    return function (next) {
        return function (action) {
            if (action.imgUploadToNodeServerConfig) {
                const { onSuccess, onError } = action;
                const { data, method = 'POST', downloadResponseFile = false, path } = action.imgUploadToNodeServerConfig;

                fetch(`${serverURL}${path}`, {
                    method,
                    body: data
                }).then(response => {
                    return (downloadResponseFile ? response.blob() : response.json())
                }).then(response => {
                    if (downloadResponseFile) {
                        const url = window.URL.createObjectURL(new Blob([response]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'file.xlsx'); //or any other extension
                        document.body.appendChild(link);
                        link.click();
                    }
                    onSuccess && onSuccess({ store, data: response, next, actions: action });
                }).catch(error => {
                    onError && onError({ store, error })
                })

            } else if (action && ((action.awsUploadConfig && Array.isArray(action.awsUploadConfig)) ||
                (action.fetchConfig && Array.isArray(action.fetchConfig)))) {

                const { onError, onSuccess } = action;
                const serverCallsArray = [];
                store.dispatch(updateLoadingStatus({ status: true }));

                if (action.fetchConfig) {
                    action.fetchConfig.forEach(config => {
                        const { path, body, method = "GET", headers = {} } = config;
                        serverCallsArray.push(getDataFromServer({
                            path,
                            body,
                            method,
                            headers: { ...headers },
                        }))
                    });
                }

                if (action.awsUploadConfig) {
                    action.awsUploadConfig.forEach(config => {
                        const { presignedUrl, contentType, name, file } = config;
                        serverCallsArray.push(uploadImagesToAWS({
                            presignedUrl, contentType, name, file,
                        }));
                    });
                }


                return Promise.all(serverCallsArray).then(responses => {
                    setTimeout(_ => {
                        store.dispatch(updateLoadingStatus({ status: false }));
                        onSuccess && onSuccess({ data: responses, store, next, actions: action });
                    }, 0)
                }).catch(error => {
                    store.dispatch(updateLoadingStatus({ status: false }));
                    onError && onError({ error, store });
                });

            } else {
                next(action);
            }
        }
    }
});
export default [middlewares];
