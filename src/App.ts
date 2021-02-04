
import express from 'express'
import { Application } from 'express'
import mongoose from 'mongoose';
import http from 'http';

const { connector } = require('swagger-routes-express');
import swaggerUi from "swagger-ui-express";

import swaggerDocument from "./swagger.json";
import { Injector } from './di-ts/Injector';

import { ErrorCallback } from './middlewares/error';
import { bearerAuthMiddleware,authorizeAccess } from './middlewares/auth';
import { validateBody, validateParams, validateQuery } from './middlewares/validate';


export class App {
    private app: Application
    private port: number

    constructor(appInit: { port: number; middleWares: any; controllers: any; }) {
        this.app = express()
        this.port = appInit.port

        this.middlewares(appInit.middleWares);
        this.generateSwagger(appInit.controllers);

    }

    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
        this.app.use(express.static('public'));
        middleWares.forEach(middleWare => {
            this.app.use(middleWare)
        })
    }

    private generateSwagger(controllers: { forEach: (arg0: (controller: any) => void) => void; }) {
        let handler = {};
        controllers.forEach(controller => {
            const resolve = Injector.resolve<any>(controller);
            handler = Object.assign(handler, resolve.getHandlers)
        })
        const connect = connector(handler, swaggerDocument, {
            apiSeparator: '_',
            security: {
                default: bearerAuthMiddleware,
            },
            middleware: {
                validateBody,
                validateParams,
                validateQuery,
                authorizeAccess
            },
        });
        connect(this.app);
        this.app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }



    public listen() {
        this.app.use(ErrorCallback);
        // this.app.listen(this.port, () => {
        //     console.log(`App listening on the http://localhost:${this.port}`);
        //     const connectionString = process.env.DB_URL || '';
        //     mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, (dbErr) => {
        //         if (dbErr) {
        //             console.error("database error", dbErr.message);
        //             process.exit(1);
        //         }
        //         console.log(`Database connected`);
        //     });
        // })
        const server = http.createServer(this.app);
        server.listen(this.port)
        server.on('error', (err) => {
            console.error("error", err.message);
            process.exit(1);
        });
        server.on('listening', () => {
            const addr: any = server.address();
            console.log(`App listening on the ${addr.port}`);
            const connectionString = process.env.DB_URL || '';
            mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, (dbErr) => {
                if (dbErr) {
                    console.error("database error", dbErr.message);
                    // process.exit(1);
                }
                console.log(`Database connected`);
            });
        });

    }
}


