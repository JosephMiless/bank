import express from 'express';
import { routes } from './utils/routes.js';
import { initDB } from './models/index.js';
import cookieParser from 'cookie-parser';


export const createApp = async () => {

    
    const app = express();
    
    app.use(cookieParser())
    app.use(express.json());

    await initDB();
    
    app.use(routes);

    return app;

};