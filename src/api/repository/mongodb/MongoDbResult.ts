import { Document, LeanDocument } from 'mongoose';

export type MongoDbResult =
  | Document
  | Document[]
  | LeanDocument<Document<any, any>>
  | LeanDocument<Document<any, any>>[];
