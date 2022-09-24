import { config } from 'dotenv';
config();

import { PartnerKey, initialize } from './database';
import fastify from 'fastify';

const server = fastify();

server.get('/ping', (req, reply) => {
    reply.send('pong');
});

server.post('/entry', async (req, rep) => {

    const key = req.headers['x-api-key'] as string;
    const partner = await PartnerKey.findOne({ where: { partnerAuthenticationKey: key } });

    console.log(partner ?? 'No partner found');

});

server.listen({
    port: process.env.API_PORT
}, () => {
    console.log(`API is listening at http://localhost:${process.env.API_PORT}`);

    initialize();
});
