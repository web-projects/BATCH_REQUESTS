import fetch from 'isomorphic-fetch';

export default class HttpDispatcher {
    processRequest(url, options, expectRawText = false) {
        return fetch(url, options)
            .then((resp) => {
                if (resp.status >= 400) {
                    throw new Error(resp.status);
                } else if (expectRawText) {
                    return resp.text();
                } else {
                    return resp.json();
                }
            }).catch((err) => {
                throw err;
            });
    }
}
