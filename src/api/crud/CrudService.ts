import { PageRequest } from '../pagination/PageRequest';
import { PageResult } from '../pagination/PageResult';

// TODO: saveBatch([entity]), updateAll, updateBatch([id]), deleteAll, deleteBatch([id])
export interface CrudService<T> {
  findAll(pageRequest: PageRequest): Promise<PageResult<T>>;
  findById(id: string): Promise<T>;
  save(entity: T): Promise<T>;
  updateById(id: string, query: T): Promise<T>;
  replaceById(id: string, query: T): Promise<T>;
  deleteById(id: string): Promise<T>;
}
