import https from 'https';
import * as HC from '../httpConstants';
import * as CC from '../constants';

const axios = require('axios').default;

export default class ProtoBufDispatcher {
    processRequest(url, encodedRequestPayload, protoBufStaticResponseObject) {
        return new Promise((resolve, reject) => {
            axios({
                method: HC.HttpPostMethodType,
                url,
                data: encodedRequestPayload,
                headers: {
                    Accept: HC.ProtoBufContentType,
                    'Content-Type': HC.ProtoBufContentType,
                },
                responseType: HC.ArrayBufferResponseType,
                httpsAgent: new https.Agent({
                    rejectUnauthorized: process.env.NODE_ENV === CC.NodeEnvironmentProduction,
                }),
            }).then((resp) => {
                resolve(protoBufStaticResponseObject.decode(resp.data));
            }).catch((err) => {
                reject(err);
            });
        });
    }
}
