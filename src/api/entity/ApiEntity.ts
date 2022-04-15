import { Entity } from './Entity';

export interface ApiEntity extends Entity {
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  getPrimaryKeys?(): string[];
}
