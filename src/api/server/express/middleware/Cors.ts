import cors from 'cors';
import { RequestHandler } from 'express';

export const Cors = (exposedHeaders?: string[]): RequestHandler =>
  cors({ credentials: true, origin: true, exposedHeaders });
