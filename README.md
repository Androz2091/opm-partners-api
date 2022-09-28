# OPM Partners API

OPM Partners API allows you to send customer data over a simple and complete REST API.

## Authentication

Your requests will be authenticated thanks to a single API key (one per project) that you can request to the OPM Media owners.

Here is an example using the `ping` endpoint:

```js
fetch('https://api.opdmf.com/ping', {
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

## Creating a customer

You can start sending customer data using the `entry` endpoint, called with the `POST` method.

```js
fetch('https://api.opdmf.com/entry', {
    method: 'POST',
    headers: {
        'x-api-key': 'REPLACE-WITH-YOUR-KEY'
    },
    body: {
        customerId: 7519,
        customerEmail: 'customer7519xx@gmail.com',
        customerPhone: '+15853042456',
        customerFirstName: 'John'
        customerLastName: 'Doe',
        customerIP: '192.168.105.240'
    }
});
```

* `customerId` is a **required** property. This is the internal ID that you uses to identify the customer in **your** database. It has to be unique, so you can update customer information later using the same ID.
* `customerEmail` is a **required** property, unless a phone number is specified (recommended).
* `customerPhone` is a **required** property, unless an email is specified (recommended).
* `customerFirstName` is an optional property (recommended).
* `customerLastName` is an optional property (recommended).
* `customerIP` is an optional property (recommended).

JSON result using a valid API key:
```json
{
    "statusCode": 201,
    "message": "OK - Created"
}
```

## Updating a customer

Use the same `entry` endpoint to update customer information, such as the email, phone, last name, first name or IP.

```js
fetch('https://api.opdmf.com/entry', {
    method: 'POST',
    headers: {
        'x-api-key': 'REPLACE-WITH-YOUR-KEY'
    },
    body: {
        customerId: 7519,
        customerEmail: 'customer7520xx@gmail.com', // update the email
        customerPhone: '+15853042456',
        customerFirstName: 'John'
        customerLastName: 'Doe',
        customerIP: '192.168.105.240'
    }
});
```

**customerId** and **x-api-key** have to be the same you used when creating the customer.

JSON result using a valid API key:
```json
{
    "statusCode": 202,
    "message": "OK - Update accepted"
}
```

## Errors

Requests that do not match the required schemas will result in a `400` error. Some examples:

When skipping required properties:
```json
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "body must have either required property 'customerEmail' or 'customerPhone'"
}
```

When using wrong properties type:
```json
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "body/customerEmail must be string"
}
```
