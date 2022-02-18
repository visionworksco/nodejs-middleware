import { RequestHandler } from 'express';
const cookieParser = require('cookie-parser');

export const CookieParser = (): RequestHandler => cookieParser();
