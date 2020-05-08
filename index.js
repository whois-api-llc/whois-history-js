'use strict'

const ApiClient = require('./include/client')
const Options = require('./include/client').Options

function makeCallback(resolve, reject) {
    return function (err, data) {
        if (err) {
            return reject(err)
        }
        return resolve(data)
    }
}

/**
 * Client for Whois XML API services.
 */
class WhoisHistoryClient {

    /**
     * @param {string} apiKey
     * @param {string} [url] - Optional. Rewrite base URL to the API endpoint
     * @param {number} [timeout] - Optional. Request timeout in milliseconds
     *      Default value is 20,000
     */
    constructor(apiKey, url, timeout) {
        this.client = new ApiClient(
            apiKey,
            url,
            timeout
        )
    }

    /**
     * Purchase returns the slice of records.
     *
     * @param {string} domainName - domain name
     * @param {Options} [options]
     * @param {Function} [cb] - Callback function(err, data).
     * @return {Object|Promise}
     */
    purchase(domainName, options, cb) {
        if (!cb || typeof cb !== 'function') {
            let self = this
            return new Promise(function (resolve, reject) {
                self._purchaseCallback(
                    domainName,
                    options,
                    makeCallback(resolve, reject)
                )
            })
        }

        this._purchaseCallback(domainName, options, cb)
    }

    /**
     * Preview returns the number of records. No credits deducted.
     *
     * @param {string} domainName - domain name
     * @param {Options} [options]
     * @param {Function} [cb] - Callback function(err, data).
     * @return {Object|Promise}
     */
    preview(domainName, options, cb) {
        if (!cb || typeof cb !== 'function') {
            let self = this
            return new Promise(function (resolve, reject) {
                self._previewCallback(
                    domainName,
                    options,
                    makeCallback(resolve, reject)
                )
            })
        }

        this._previewCallback(domainName, options, cb)
    }

    /**
     *
     * @param {String} domainName
     * @param {Options} [options]
     * @param {function} [cb]
     */
    _purchaseCallback(domainName, options, cb) {
        this.client.purchase(domainName, options)
            .then(function (data) {
                try {
                    let l = []
                    for (let r of data['records']) {
                        l.push(new WhoisRecord(r))
                    }
                    return cb(null, l)
                } catch (e) {
                    return cb(e, null)
                }
            })
            .catch(function (err) {
                return cb(err, null)
            })
    }

    /**
     *
     * @param {String} domainName
     * @param {Options} [options]
     * @param {function} [cb]
     */
    _previewCallback(domainName, options, cb) {
        this.client.preview(domainName, options)
            .then(function (data) {
                try {
                    let n = Number(data['recordsCount'])
                    return cb(null, n)
                } catch (e) {
                    return cb(e, null)
                }
            })
            .catch(function (err) {
                return cb(err, null)
            })
    }
}


/**
 * @param {Object} values
 * @param {String} key
 * @return String
 */
function getString(values, key) {
    if (key in values) {
        return String(values[key])
    }
    return ''
}

/**
 * @param {Object} values
 * @param {String} key
 * @return Date
 */
function getDate(values, key) {
    if (key in values) {
        return new Date(values[key])
    }
    return null
}

class Contact {
    /**
     *
     * @param {Object} data
     * @return {string}
     */
    constructor(data = null) {
        if (data == null) {
            data = {}
        }

        this.name = getString(data, 'name')
        this.organization = getString(data, 'organization')
        this.street = getString(data, 'street')
        this.city = getString(data, 'city')
        this.state = getString(data, 'state')
        this.postalCode = getString(data, 'postalCode')
        this.country = getString(data, 'country')
        this.email = getString(data, 'email')
        this.telephone = getString(data, 'telephone')
        this.telephoneExt = getString(data, 'telephoneExt')
        this.fax = getString(data, 'fax')
        this.faxExt = getString(data, 'faxExt')
        this.rawText = getString(data, 'rawText')
    }
}

class Audit {
    constructor(data = null) {
        if (data == null) {
            data = {}
        }

        this.createdDate = getDate(data, 'createdDate')
        this.updatedDate = getDate(data, 'updatedDate')
    }
}

/**
 * UnmarshalJSON decodes time as historic whois API does
 */
class WhoisRecord {
    /**
     * Create a result object from JSON API response
     *
     * @param data
     */
    constructor(data = null) {
        if (data == null) {
            data = {}
        }

        this.domainName = getString(data, 'domainName')
        this.domainType = getString(data, 'domainType')
        this.createdDateISO8601 = getDate(data, 'createdDateISO8601')
        this.updatedDateISO8601 = getDate(data, 'updatedDateISO8601')
        this.expiresDateISO8601 = getDate(data, 'expiresDateISO8601')
        this.createdDateRaw = getString(data, 'createdDateRaw')
        this.updatedDateRaw = getString(data, 'updatedDateRaw')
        this.expiresDateRaw = getString(data, 'expiresDateRaw')
        this.audit = new Audit(data.audit)
        this.nameServers = data.nameServers
        this.whoisServer = getString(data, 'whoisServer')
        this.registrarName = getString(data, 'registrarName')
        this.status = data.status
        this.cleanText = getString(data, 'cleanText')
        this.rawText = getString(data, 'rawText')
        this.registrantContact = ('registrantContact' in data) ? (new Contact(data.registrantContact)) : null
        this.administrativeContact = ('administrativeContact' in data) ? (new Contact(data.administrativeContact)) : null
        this.technicalContact = ('technicalContact' in data) ? (new Contact(data.technicalContact)) : null
        this.billingContact = ('billingContact' in data) ? (new Contact(data.billingContact)) : null
        this.zoneContact = ('zoneContact' in data) ? (new Contact(data.zoneContact)) : null
    }
}

exports.Client = WhoisHistoryClient
exports.Contact = Contact
exports.Audit = Audit
exports.WhoisRecord = WhoisRecord