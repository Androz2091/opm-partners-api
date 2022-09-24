import { Entity, Column, DataSource, PrimaryGeneratedColumn, BaseEntity, AfterInsert } from "typeorm";
import fastify from 'fastify';
import { Database, Resource } from '@adminjs/typeorm';
import { validate } from 'class-validator';
import fastifyStatic from '@fastify/static';

import AdminJS from 'adminjs';
import AdminJSFastify from '@adminjs/fastify';
import { join } from "path";

Resource.validate = validate;
AdminJS.registerAdapter({ Database, Resource });

@Entity()
export class PartnerKey extends BaseEntity {

    @AfterInsert()
    createKey () {
        this.partnerAuthenticationKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.save();
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    partnerName!: string;
    
    @Column({
        nullable: true,
        unique: true
    })
    partnerAuthenticationKey!: string;

}

const resources = [PartnerKey];

export const Postgres = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    entities: resources,
    synchronize: process.env.ENVIRONMENT === 'development',
});

export const initialize = () => Postgres.initialize().then(async () => {
    if (process.env.ADMINJS_PORT) {
        const app = fastify();
        const admin = new AdminJS({
            branding: {
                companyName: 'OPM Partners',
            },
            rootPath: '/admin',
            resources: resources.map((r) => ({
                resource: r,
                options: (r === PartnerKey) ? {
                    properties: {
                        partnerAuthenticationKey: {
                            description: 'Let empty when creating a new partner'
                        }
                    }
                } : undefined
            }))
        })
        app.register(fastifyStatic, {
            root: join(__dirname, '../public'),
            prefix: '/public/',
        });
        await AdminJSFastify.buildAuthenticatedRouter(admin, {
            cookiePassword: process.env.ADMINJS_COOKIE_PASSWORD,
            cookieName: 'adminjs',
            authenticate: async (_email, password) => {
                // todo: remove
                return true;
                if (password === process.env.ADMINJS_PASSWORD) {
                    return true;
                }
            }
        }, app)
        app.listen({
            port: process.env.ADMINJS_PORT
        }, () => {
            console.log(`AdminJS is listening at http://localhost:${process.env.ADMINJS_PORT}`)
        });
    }
    
});
