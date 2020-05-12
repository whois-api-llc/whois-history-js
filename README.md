# Overview

The client library for
[Whois History API](https://whois-history.whoisxmlapi.com/)
for Node.js.

The minimum Node.js version is 8.

# Installation

The library is distributed via npm

```bash
npm install whois-history
```

# Examples

Full API documentation available [here](https://whois-history.whoisxmlapi.com/api/documentation/making-requests)

## Create a new client

```javascript
const WhoisHistoryClient = require('whois-history').Client;
const Options = require('whois-history/include/client').Options;

let client = new WhoisHistoryClient(
    'Your API Key'
);
```

## Make basic requests

```javascript
// Check how many records available. It doesn't deduct credits.
client.preview('whoisxmlapi.com')
    .then(function (data) {
        console.log(data);
    })
    .catch(function (error) {
        console.log(error);
    });

// Get actual list of records.
client.purchase('whoisxmlapi.com')
    .then(function (data) {
        console.log(data);
    })
    .catch(function (error) {
        console.log(error);
    });
```

## Additional options
You can specify search options for these methods.

```javascript
let date = new Date("2017-01-01")

let options = new Options()

options.sinceDate = date
options.createdDateFrom = date
options.createdDateTo = date
options.updatedDateFrom = date
options.updatedDateTo = date
options.expiredDateFrom = date
options.expiredDateTo = date

client.preview('whoisxmlapi.com', options)
    .then(function (data) {
        console.log(data);
    })
    .catch(function (error) {
        console.log(error);
    });
```

## Using Callback
```javascript
client.preview('whoisxmlapi.com', new Options(), function (err, res) {
    if (err) {
        console.log(err);
    } else {
        console.log(res);
    }
});
```
