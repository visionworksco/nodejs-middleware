import cors from 'cors';
import { RequestHandler } from 'express';

export const CorsHandler = (exposedHeaders?: string[]): RequestHandler =>
  cors({ credentials: true, origin: true, exposedHeaders });
