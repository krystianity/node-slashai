const request = require("request");

const SLASH_SCHEME = "https";
const SLASH_HOST = "api.slash.ai";
const SLASH_CONTENT = "application/json";
const SLASH_TIMEOUT = 5000;
const ERRCODE_KEY_EXPIRED = "keymanagement.service.access_token_expired";

class RestClient {

    constructor({ email, password, log }){

        this._token = undefined;
        this._auth = {
            email,
            password
        };
        this._log = log;
    }

    promreq(options){

        this.log(`client -> slash : ${options.method} to ${options.url} with body ${!!options.body}, ` +
            `with auth ${!!options.headers.authorization}.`);

        return new Promise((resolve, reject) => {
            request(options, (err, response, body) => {

                if(err){
                    this.log(`client <- slash : ${options.method} to ${options.url} result => ERROR : ${err.message}.`);
                    return reject(err);
                }

                if(body && response.headers &&
                    response.headers["content-type"] &&
                    response.headers["content-type"].indexOf(SLASH_CONTENT) !== -1){
                    body = JSON.parse(body);
                }

                this.log(`client <- slash : ${options.method} to ${options.url} result => ` +
                    `${response.statusCode}, got body ${!!body}.`);

                resolve({
                    status: response.statusCode,
                    headers: response.headers,
                    body: body
                });
            });
        });
    }

    log(msg){
        if(typeof this._log === "function"){
            this._log(msg);
        }
    }

    static _getUrl(endpoint){
        endpoint = endpoint || "";
        return SLASH_SCHEME + "://" + SLASH_HOST + (endpoint.startsWith("/") ? endpoint : "/" + endpoint);
    }

    _getOptions(method = "GET", endpoint = "/", body){

        if(body && typeof body !== "string"){
            body = JSON.stringify(body);
        }

        return {
            method: method,
            url: RestClient._getUrl(endpoint),
            headers: {
                authorization: this._token,
                "content-type": SLASH_CONTENT
            },
            body: body,
            time: true,
            gzip: true,
            timeout: SLASH_TIMEOUT
        };
    }

    refreshToken(){
        const options = this._getOptions("POST", "/api/customer/login", this._auth);
        return this.promreq(options).then(response => {

            if(response.status === 201 && response.body.token){
                this._token = response.body.token;
                return response.body;
            }

            return null;
        });
    }

    _request(options){
        return this.promreq(options).then(response => {

            if(response.status === 401){

                if(this._token && response.body && response.body.fault && response.body.fault.detail &&
                    response.body.fault.detail.errorcode !== ERRCODE_KEY_EXPIRED){
                    throw new Error("received status code 401, but could not identify refresh token action.");
                }

                return this.refreshToken().then(token => {

                    if(!token){
                        throw new Error("failed to get api token with provided credentials.");
                    }

                    options.headers.authorization = this._token;
                    return this.promreq(options);
                });
            }

            return response;
        });
    }

    request(method, endpoint, body){
        const options = this._getOptions(method, endpoint, body);
        return this._request(options);
    }

    status(id){
        return this.request("GET", "/api/v2/status/" + id);
    }

    await(id){
        return this.status(id).then(({status, body}) => {

            if(status === 202){
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve();
                    }, 1500);
                }).then(r => {
                    return this.await(id);
                });
            }

            return body;
        });
    }
}

module.exports = RestClient;