# OPM Partners API

OPM Partners API allows you to send customer data over a simple and complete REST API.

## Authentication

Your requests will be authenticated thanks to a single API key (one per project) that you can request to the OPM Media owners.

Here is an example using the `ping` endpoint:

```js
fetch('https://api.opm-media.io/ping', {
    headers: {
        'x-api-key': 'REPLACE-WITH-YOUR-KEY'
    }
});
```

JSON result using a valid API key:
```json
{
    "statusCode": 200,
    "message": "pong"
}
```

JSON result using an invalid API key:
```json
{
    "statusCode": 401,
    "error": "Unauthorized",
    "message": "API key does not exist"
}
```
