'use strict'

const httpClient = require('urllib')

const VERSION = require("../package.json").version
const DEFAULT_URL = 'https://whois-history.whoisxmlapi.com/api/v1'
const USER_AGENT = "whoisxmlapi-js/" + VERSION
const DEFAULT_TIMEOUT = 20000


class APIError {
    constructor(status, code, message) {
        this.status = status
        this.code = code
        this.message = message
    }

    toString() {
        if (this.code !== null) {
            return '[' + this.code + '] ' + this.message
        }
        return '[' + this.status + '] ' + this.message
    }
}

class Options {
    constructor() {
        /**
         * OptionSinceDate filters activities discovered since the given date.
         * Sometimes there is a latency between the actual added/renewal/expired date
         * and the date when our system detected this change.
         * Time is ignored and only the date is used.
         * @type {Date|null} sinceDate
         */
        this.sinceDate = null
        /**
         * OptionCreatedDateFrom searches through domains created after the given date.
         * @type {Date|null}
         */
        this.createdDateFrom = null
        /**
         * OptionCreatedDateTo searches through domains created before the given date.
         * @type {Date|null}
         */
        this.createdDateTo = null
        /**
         * OptionUpdatedDateFrom searches through domains updated after the given date.
         * @type {Date|null}
         */
        this.updatedDateFrom = null
        /**
         * OptionUpdatedDateTo searches through domains updated before the given date.
         * @type {Date|null}
         */
        this.updatedDateTo = null
        /**
         * OptionExpiredDateFrom searches through domains expired after the given date.
         * @type {Date|null}
         */
        this.expiredDateFrom = null
        /**
         * OptionExpiredDateTo searches through domains expired before the given date.
         * @type {Date|null}
         */
        this.expiredDateTo = null
    }
}

class ApiClient {

    /**
     *
     * @param {string} apiKey
     * @param {string} [url]
     * @param {int} [timeout]
     */
    constructor(apiKey, url = DEFAULT_URL, timeout = DEFAULT_TIMEOUT) {
        this.apiKey = apiKey
        this.url = url
        this.timeout = timeout

        this.verifyOptions()
    }

    verifyOptions() {
        if (!this.apiKey || typeof this.apiKey !== 'string') {
            throw new Error("API key is required and must be a string")
        }

        if (typeof this.url !== "string") {
            throw new Error("URL must be a string")
        }

        if (typeof this.timeout !== "number") {
            throw new Error("Timeout must be a number")
        }
    }

    /**
     *
     * @param {object}params
     * @param {Options} options
     * @return void
     */
    _addOptions(params, options) {

        if (options == null) {
            return
        }

        /**
         * @param {Date} date
         */
        function fmt(date) {
            let y = date.getUTCFullYear()
            let m = date.getUTCMonth() + 1
            if (m < 10) {
                m = '0' + m
            }
            let d = date.getUTCDate()
            if (d < 10) {
                d = '0' + d
            }

            return y + '-' + m + '-' + d
        }

        for (let key of [
            'sinceDate',
            'createdDateFrom',
            'createdDateTo',
            'updatedDateFrom',
            'updatedDateTo',
            'expiredDateFrom',
            'expiredDateTo',
        ]) {
            if (options[key] !== null) {
                params[key] = fmt(options[key])
            }
        }
    }

    _validateParams(domainName, options) {
        if (typeof domainName !== "string") {
            return new Error("domainName is required and has to be a string")
        }
        if (options !== undefined && options != null && !(options instanceof Options)) {
            return new Error("options has to be an instance of Options")
        }
        return null
    }

    /**
     *
     * @param {String} domainName
     * @param {Options} [options]
     * @returns {Promise<unknown>}
     */
    purchase(domainName, options) {
        let self = this

        let err = this._validateParams(domainName, options)

        return new Promise(function (resolve, reject) {
            if (err !== null) {
                reject(err)
            }

            let queryParams = {
                'outputFormat': 'JSON',
                'domainName': domainName,
                'apiKey': self.apiKey,
                'mode': 'purchase',
            }

            self._addOptions(queryParams, options)

            let reqOptions = {
                method: 'GET',
                timeout: self.timeout,
                data: queryParams,
            }

            reqOptions.headers = {
                'User-Agent': USER_AGENT,
            }
            self.request(resolve, reject, reqOptions)
        })
    }

    /**
     *
     * @param {String} domainName
     * @param {Options} [options]
     * @returns {Promise<unknown>}
     */
    preview(domainName, options) {
        let self = this

        let err = this._validateParams(domainName, options)

        return new Promise(function (resolve, reject) {
            if (err !== null) {
                reject(err)
            }

            let queryParams = {
                'outputFormat': 'JSON',
                'domainName': domainName,
                'apiKey': self.apiKey,
                'mode': 'preview',
            }

            self._addOptions(queryParams, options)

            let reqOptions = {
                method: 'GET',
                timeout: self.timeout,
                data: queryParams,
            }

            reqOptions.headers = {
                'User-Agent': USER_AGENT,
            }
            self.request(resolve, reject, reqOptions)
        })
    }

    request(resolve, reject, options) {
        httpClient.request(
            DEFAULT_URL,
            options
        ).then(
            function (response) {
                if (response.res.statusCode !== 200) {
                    try {
                        let data = JSON.parse(response.data.toString())
                        if ('code' in data || 'messages' in data) {
                            reject(new APIError(response.res.statusCode, data['code'], data['messages']))
                            return
                        }
                    } catch (e) {
                    }
                    reject(new APIError(response.res.statusCode, null, response.res.statusMessage))
                    return
                }
                let data = JSON.parse(response.data.toString())
                if ('code' in data || 'messages' in data) {
                    reject(new APIError(response.res.statusCode, data['code'], data['messages']))
                    return
                }
                resolve(data)
            }
        ).catch(
            function (error) {
                return reject(error)
            }
        );
    }
}

module.exports = ApiClient
module.exports.Options = Options
module.exports.APIError = APIError