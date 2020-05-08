"use strict";

process.env.TZ = 'UTC'

const assert = require("assert");
const ApiClient = require("..").Client;
const Options = require('../include/client').Options;
const APIError = require('../include/client').APIError;
const Contact = require("..").Contact;
const WhoisRecord = require("..").WhoisRecord;
const Audit = require("..").Audit;
const nock = require('nock');
const rewiremock = require('rewiremock/node');

const responsePreview = {
    recordsCount: 2
}

const responsePurchase = {
    recordsCount: 2,
    records: [
        {
            "domainName": "whoisxmlapi.com",
            "domainType": "added",
            "createdDateISO8601": "2009-03-20T02:47:17.000Z",
            "updatedDateISO8601": "2020-03-03T05:43:57.000Z",
            "expiresDateISO8601": "2022-03-20T02:47:17.000Z",
            "createdDateRaw": "2009-03-20 02:47:17 UTC",
            "updatedDateRaw": "2020-03-03 05:43:57 UTC",
            "expiresDateRaw": "2022-03-20 02:47:17 UTC",
            "audit": {
                "createdDate": "2020-05-05T01:42:13.000Z",
                "updatedDate": "2020-05-05T01:42:13.000Z"
            },
            "nameServers": [
                "CARL.NS.CLOUDFLARE.COM",
                "ELLE.NS.CLOUDFLARE.COM"
            ],
            "whoisServer": "whois.godaddy.com",
            "registrarName": "GoDaddy.com, LLC",
            "status": [
                "clientDeleteProhibited clientRenewProhibited clientTransferProhibited clientUpdateProhibited"
            ],
            "cleanText": "",
            "rawText": "",
            "registrantContact": {
                "name": "Registration Private",
                "organization": "Domains By Proxy, LLC",
                "street": "DomainsByProxy.com\n14455 N. Hayden Road",
                "city": "Scottsdale",
                "state": "Arizona",
                "postalCode": "85260",
                "country": "UNITED STATES",
                "email": "WHOISXMLAPI.COM@domainsbyproxy.com",
                "telephone": "14806242599",
                "telephoneExt": "",
                "fax": "14806242598",
                "faxExt": "",
                "rawText": ""
            },
            "administrativeContact": {
                "name": "Registration Private",
                "organization": "Domains By Proxy, LLC",
                "street": "DomainsByProxy.com\n14455 N. Hayden Road",
                "city": "Scottsdale",
                "state": "Arizona",
                "postalCode": "85260",
                "country": "UNITED STATES",
                "email": "WHOISXMLAPI.COM@domainsbyproxy.com",
                "telephone": "",
                "telephoneExt": "",
                "fax": "14806242598",
                "faxExt": "",
                "rawText": ""
            },
            "technicalContact": {
                "name": "Registration Private",
                "organization": "Domains By Proxy, LLC",
                "street": "DomainsByProxy.com\n14455 N. Hayden Road",
                "city": "Scottsdale",
                "state": "Arizona",
                "postalCode": "85260",
                "country": "UNITED STATES",
                "email": "WHOISXMLAPI.COM@domainsbyproxy.com",
                "telephone": "",
                "telephoneExt": "",
                "fax": "14806242598",
                "faxExt": "",
                "rawText": ""
            },
            "billingContact": {
                "name": "",
                "organization": "",
                "street": "",
                "city": "",
                "state": "",
                "postalCode": "",
                "country": "",
                "email": "",
                "telephone": "",
                "telephoneExt": "",
                "fax": "",
                "faxExt": "",
                "rawText": ""
            },
            "zoneContact": {
                "name": "",
                "organization": "",
                "street": "",
                "city": "",
                "state": "",
                "postalCode": "",
                "country": "",
                "email": "",
                "telephone": "",
                "telephoneExt": "",
                "fax": "",
                "faxExt": "",
                "rawText": ""
            }
        },
        {
            "domainName": "whoisxmlapi.com",
            "domainType": "added",
            "createdDateISO8601": "2009-03-20T02:47:17.000Z",
            "updatedDateISO8601": "2019-03-20T17:08:52.000Z",
            "expiresDateISO8601": "2022-03-20T02:47:17.000Z",
            "createdDateRaw": "2009-03-20T02:47:17Z",
            "updatedDateRaw": "2019-03-20T17:08:52Z",
            "expiresDateRaw": "2022-03-20T02:47:17Z",
            "audit": {
                "createdDate": "2020-03-05T00:38:09.000Z",
                "updatedDate": "2020-03-05T00:38:09.000Z"
            },
            "nameServers": [
                "CARL.NS.CLOUDFLARE.COM",
                "ELLE.NS.CLOUDFLARE.COM"
            ],
            "whoisServer": "whois.godaddy.com",
            "registrarName": "GoDaddy.com, LLC",
            "status": [
                "clientTransferProhibited clientUpdateProhibited clientRenewProhibited clientDeleteProhibited"
            ],
            "cleanText": "",
            "rawText": "",
            "registrantContact": {
                "name": "Registration Private",
                "organization": "Domains By Proxy, LLC",
                "street": "DomainsByProxy.com\n14455 N. Hayden Road",
                "city": "Scottsdale",
                "state": "Arizona",
                "postalCode": "85260",
                "country": "UNITED STATES",
                "email": "WHOISXMLAPI.COM@domainsbyproxy.com",
                "telephone": "14806242599",
                "telephoneExt": "",
                "fax": "14806242598",
                "faxExt": "",
                "rawText": ""
            },
            "administrativeContact": {
                "name": "Registration Private",
                "organization": "Domains By Proxy, LLC",
                "street": "DomainsByProxy.com\n14455 N. Hayden Road",
                "city": "Scottsdale",
                "state": "Arizona",
                "postalCode": "85260",
                "country": "UNITED STATES",
                "email": "WHOISXMLAPI.COM@domainsbyproxy.com",
                "telephone": "14806242599",
                "telephoneExt": "",
                "fax": "14806242598",
                "faxExt": "",
                "rawText": ""
            },
            "technicalContact": {
                "name": "Registration Private",
                "organization": "Domains By Proxy, LLC",
                "street": "DomainsByProxy.com\n14455 N. Hayden Road",
                "city": "Scottsdale",
                "state": "Arizona",
                "postalCode": "85260",
                "country": "UNITED STATES",
                "email": "WHOISXMLAPI.COM@domainsbyproxy.com",
                "telephone": "14806242599",
                "telephoneExt": "",
                "fax": "14806242598",
                "faxExt": "",
                "rawText": ""
            },
            "billingContact": {
                "name": "",
                "organization": "",
                "street": "",
                "city": "",
                "state": "",
                "postalCode": "",
                "country": "",
                "email": "",
                "telephone": "",
                "telephoneExt": "",
                "fax": "",
                "faxExt": "",
                "rawText": ""
            },
            "zoneContact": {
                "name": "",
                "organization": "",
                "street": "",
                "city": "",
                "state": "",
                "postalCode": "",
                "country": "",
                "email": "",
                "telephone": "",
                "telephoneExt": "",
                "fax": "",
                "faxExt": "",
                "rawText": ""
            }
        },
    ]
};

const responseError = {
    code: 123,
    messages: "error message",
};


describe('APIClient', () => {
    describe('#verifyOptions', () => {
        it("should throw an error if no API token is supplied", () => {
            assert.throws(
                () => {
                    new ApiClient();
                },
                {
                    name: 'Error',
                    message: "API key is required and must be a string"
                });
        });
        it("should throw an error if bad API token is supplied", () => {
            assert.throws(
                () => {
                    new ApiClient(123);
                },
                {
                    name: 'Error',
                    message: "API key is required and must be a string"
                });
        });

        it("should throw an error if bad URL is supplied", () => {
            assert.throws(
                () => {
                    new ApiClient('token', 123);
                },
                {
                    name: 'Error',
                    message: "URL must be a string"
                });
        });

        it("should throw an error if bad timeout is supplied", () => {
            assert.throws(
                () => {
                    new ApiClient('token', 'URL', 'time');
                },
                {
                    name: 'Error',
                    message: "Timeout must be a number"
                });
        });
    });

    describe('#API', () => {
        it("Successful preview call", (done) => {
            nock('https://whois-history.whoisxmlapi.com')
                .get('/api/v1?outputFormat=JSON&domainName=domain.test&apiKey=apiKey&mode=preview')
                .reply(200, responsePreview);

            let c = new ApiClient('apiKey');

            c.preview('domain.test', new Options(), (err, data) => {
                assert.ifError(err);
                assert.strictEqual(data, 2);
                done();
            });
        });

        it("Successful purchase call", (done) => {
            nock('https://whois-history.whoisxmlapi.com')
                .get('/api/v1?outputFormat=JSON&domainName=domain.test&apiKey=apiKey&mode=purchase')
                .reply(200, responsePurchase);

            let c = new ApiClient('apiKey');

            let l = []
            for (let r of responsePurchase.records) {
                l.push(new WhoisRecord(r))
            }

            c.purchase('domain.test', new Options(), (err, data) => {
                assert.ifError(err);
                assert.deepStrictEqual(data, l);
                done();
            });
        });

        it("should throw an error on http error", (done) => {
            nock('https://whois-history.whoisxmlapi.com')
                .get('/api/v1?outputFormat=JSON&domainName=domain.test&apiKey=apiKey&mode=purchase')
                .reply(400, responseError);

            let c = new ApiClient('apiKey');

            c.purchase('domain.test', new Options(), (err, data) => {
                assert(err instanceof APIError);
                assert.deepStrictEqual(err.toString(), '[123] error message');
                done();
            })
        });

        it("should throw error on non valid JSON response", (done) => {
            nock('https://whois-history.whoisxmlapi.com')
                .get('/api/v1?outputFormat=JSON&domainName=domain.test&apiKey=apiKey&mode=preview')
                .reply(200, 'response');

            let c = new ApiClient('apiKey');

            c.preview('domain.test', new Options(), (err, data) => {
                assert(err instanceof Error);
                assert.deepStrictEqual(err.toString(), 'SyntaxError: Unexpected token r in JSON at position 0');
                done();
            })
        });
    });
});

describe('Models', () => {
    describe('Audit', () => {
        it("Parse", () => {
            let actual = new Audit({
                'createdDate': '2006-01-02T15:04:05+07:00',
                'updatedDate': '2006-01-02T15:04:05-07:00',
            })

            let expected = new Audit()
            expected.createdDate = new Date(2006, 0, 2, 8, 4, 5, 0)
            expected.updatedDate = new Date(2006, 0, 2, 22, 4, 5, 0)

            assert.deepStrictEqual(actual, expected)
        })
    })

    describe('Contact', () => {
        it("Parse", () => {
            let actual = new Contact({
                name: 'name-value',
                organization: 'organization-value',
                street: 'street-value',
                city: 'city-value',
                state: 'state-value',
                postalCode: 'postalCode-value',
                country: 'country-value',
                email: 'email-value',
                telephone: 'telephone-value',
                telephoneExt: 'telephoneExt-value',
                fax: 'fax-value',
                faxExt: 'faxExt-value',
                rawText: 'rawText-value',
            })

            let expected = new Contact()
            expected.name = 'name-value'
            expected.organization = 'organization-value'
            expected.street = 'street-value'
            expected.city = 'city-value'
            expected.state = 'state-value'
            expected.postalCode = 'postalCode-value'
            expected.country = 'country-value'
            expected.email = 'email-value'
            expected.telephone = 'telephone-value'
            expected.telephoneExt = 'telephoneExt-value'
            expected.fax = 'fax-value'
            expected.faxExt = 'faxExt-value'
            expected.rawText = 'rawText-value'

            assert.deepStrictEqual(actual, expected)
        })
    })

    describe('WhoisRecord', () => {
        it("Parse", () => {
            let actual = new WhoisRecord({
                "domainName": "domainName-value",
                "domainType": "domainType-value",
                "createdDateISO8601": '2006-01-02T15:04:01-07:00',
                "updatedDateISO8601": '2006-01-02T15:04:02-07:00',
                "expiresDateISO8601": '2006-01-02T15:04:03-07:00',
                "createdDateRaw": "createdDateRaw-value",
                "updatedDateRaw": "updatedDateRaw-value",
                "expiresDateRaw": "expiresDateRaw-value",
                "audit": {
                    'createdDate': '2006-01-02T15:04:05-07:00'
                },
                "nameServers": "nameServers-value",
                "whoisServer": "whoisServer-value",
                "registrarName": "registrarName-value",
                "status": "status-value",
                "cleanText": "cleanText-value",
                "rawText": "rawText-value",
                "registrantContact": {
                    'name': "registrantContact-value",
                },
                "administrativeContact": {
                    'name': "administrativeContact-value",
                },
                "technicalContact": {
                    'name': "technicalContact-value",
                },
                "billingContact": {
                    'name': "billingContact-value",
                },
                "zoneContact": {
                    'name': "zoneContact-value",
                },
            })

            let expected = new WhoisRecord()
            expected.domainName = "domainName-value"
            expected.domainType = "domainType-value"
            expected.createdDateISO8601 = new Date('2006-01-02T15:04:01-07:00')
            expected.updatedDateISO8601 = new Date('2006-01-02T15:04:02-07:00')
            expected.expiresDateISO8601 = new Date('2006-01-02T15:04:03-07:00')
            expected.createdDateRaw = "createdDateRaw-value"
            expected.updatedDateRaw = "updatedDateRaw-value"
            expected.expiresDateRaw = "expiresDateRaw-value"
            expected.audit = new Audit({
                'createdDate': '2006-01-02T15:04:05-07:00'
            })
            expected.nameServers = "nameServers-value"
            expected.whoisServer = "whoisServer-value"
            expected.registrarName = "registrarName-value"
            expected.status = "status-value"
            expected.cleanText = "cleanText-value"
            expected.rawText = "rawText-value"
            expected.registrantContact = new Contact({
                'name': "registrantContact-value",
            })
            expected.administrativeContact = new Contact({
                'name': "administrativeContact-value",
            })
            expected.technicalContact = new Contact({
                'name': "technicalContact-value",
            })
            expected.billingContact = new Contact({
                'name': "billingContact-value",
            })
            expected.zoneContact = new Contact({
                'name': "zoneContact-value",
            })

            assert.deepStrictEqual(actual, expected)
        })
    })
})
