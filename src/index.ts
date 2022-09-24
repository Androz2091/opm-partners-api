import { config } from 'dotenv';
config();

import { PartnerKey, initialize, CustomerData } from './database';
import fastify from 'fastify';

const server = fastify();

server.get('/ping', {

    schema: {
        headers: {
            type: 'object',
            required: ['x-api-key'],
            properties: {
                'x-api-key': { type: 'string' },
            }
        }
    },

    handler: async (req, rep) => {

        const key = req.headers['x-api-key'] as string;
        const partner = await PartnerKey.findOne({
            where: {
                partnerAuthenticationKey: key
            }
        });
        
        if (!partner) {
            return rep.status(401).send({
                statusCode: 401,
                error: "Unauthorized",
                message: "API key does not exist"
            });
        }

        rep.status(200).send({
            statusCode: 200,
            message: "pong"
        });

    }

});

server.post('/entry', {

    schema: {
        headers: {
            type: 'object',
            required: ['x-api-key'],
            properties: {
                'x-api-key': { type: 'string' },
            }
        },
        body: {
            type: 'object',
            required: ['customerId'],
            properties: {
                customerId: {
                    type: 'string',
                },
                customerEmail: {
                    type: 'string',
                    nullable: true,
                },
                customerPhone: {
                    type: 'string',
                    nullable: true,
                },
                customerFirstName: {
                    type: 'string',
                    nullable: true,
                },
                customerLastName: {
                    type: 'string',
                    nullable: true,
                },
                customerIP: {
                    type: 'string',
                    nullable: true,
                }
            }
        }
    },

    handler: async (req, rep) => {

        const key = req.headers['x-api-key'] as string;
        const partner = await PartnerKey.findOne({
            where: {
                partnerAuthenticationKey: key
            }
        });
        
        if (!partner) {
            return rep.status(401).send({
                statusCode: 401,
                error: "Unauthorized",
                message: "API key does not exist"
            });
        }

        const data = req.body as Partial<{
            customerId: string;
            customerEmail: string;
            customerPhone: string;
            customerFirstName: string;
            customerLastName: string;
            customerIP: string;
        }>;

        if (!data.customerEmail && !data.customerPhone) {
            return rep.status(400).send({
                statusCode: 400,
                error: "Bad Request",
                message: "body must have either required property 'customerEmail' or 'customerPhone'"
            });
        }

        const existingCustomer = await CustomerData.findOne({
            where: {
                customerId: data.customerId,
                partner: {
                    id: partner.id
                }
            }
        });

        if (existingCustomer) {

            if (data.customerEmail) existingCustomer.customerEmail = data.customerEmail;
            if (data.customerPhone) existingCustomer.customerPhone = data.customerPhone;
            if (data.customerFirstName) existingCustomer.customerFirstName = data.customerFirstName;
            if (data.customerLastName) existingCustomer.customerLastName = data.customerLastName;
            if (data.customerIP) existingCustomer.customerIP = data.customerIP;
            await existingCustomer.save();

            return rep.status(202).send({
                statusCode: 202,
                message: "OK - Update accepted"
            });
        }

        const customer = new CustomerData();
        customer.customerId = data.customerId!;
        if (data.customerEmail) customer.customerEmail = data.customerEmail;
        if (data.customerPhone) customer.customerPhone = data.customerPhone;
        if (data.customerFirstName) customer.customerFirstName = data.customerFirstName;
        if (data.customerLastName) customer.customerLastName = data.customerLastName;
        if (data.customerIP) customer.customerIP = data.customerIP;
        customer.partner = partner;

        await customer.save();

        return rep.status(201).send({
            statusCode: 201,
            message: "OK - Created"
        });

    }

});

server.listen({
    port: process.env.API_PORT
}, () => {
    console.log(`API is listening at http://localhost:${process.env.API_PORT}`);

    initialize();
});
