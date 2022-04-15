import { ClassTransformer } from '../../app/class/ClassTransformer';
import { ApiEntity } from '../entity/ApiEntity';
import { PageRequest } from '../pagination/PageRequest';
import { PageResult } from '../pagination/PageResult';
import { Repository } from '../repository/Repository';
import { ServerException } from '../server/express/exception/ServerException';
import { ObjectUtils } from '../utils/ObjectUtils';
import { CrudService } from './CrudService';

export abstract class BaseCrudService<T extends ApiEntity> implements CrudService<T> {
  protected repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async findAll(pageRequest: PageRequest): Promise<PageResult<T>> {
    try {
      const pageResult = await this.repository.findAll(pageRequest);
      const pageResultUpdated = { ...pageResult };
      pageResultUpdated.data = this.normalize(pageResultUpdated.data) as T[];

      return Promise.resolve(pageResultUpdated);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findById(id: string): Promise<T> {
    try {
      const entity = await this.repository.findById(id);
      if (!entity) {
        throw ServerException.NotFoundException();
      }

      return Promise.resolve(this.normalize(entity) as T);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async save(entity: T): Promise<T> {
    try {
      await this.isConflict(entity);

      const entityUpdated = await this.preSave(entity);
      const entitySaved = await this.repository.save(entityUpdated);
      await this.postSave(entitySaved);

      return Promise.resolve(this.normalize(entitySaved) as T);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async isConflict(entity: T): Promise<boolean> {
    try {
      const keys = entity.getPrimaryKeys ? (entity.getPrimaryKeys() as (keyof T)[]) : [];
      if (keys.length === 0) {
        return Promise.resolve(true);
      }

      const query = ObjectUtils.destruct(entity, keys);
      if (await this.repository.findOne(query)) {
        throw ServerException.AlreadyExistsException(query);
      }

      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  protected async preSave(entity: T): Promise<T> {
    return Promise.resolve(entity);
  }

  protected async postSave(entitySaved: T): Promise<void> {
    return Promise.resolve();
  }

  async updateById(id: string, query: T): Promise<T> {
    try {
      const queryUpdated = await this.preUpdate(query);
      const queryUpdatedPlain = ClassTransformer.toPlain(queryUpdated);

      const entityUpdated = await this.repository.updateById(id, queryUpdatedPlain);
      if (!entityUpdated) {
        throw ServerException.NotFoundException();
      }
      await this.postUpdate(entityUpdated);

      return Promise.resolve(this.normalize(entityUpdated) as T);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  protected async preUpdate(entity: T): Promise<T> {
    return Promise.resolve(entity);
  }

  protected async postUpdate(entityUpdated: T): Promise<void> {
    return Promise.resolve();
  }

  async replaceById(id: string, query: T): Promise<T> {
    try {
      throw ServerException.MethodNotAllowedException();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteById(id: string): Promise<T> {
    try {
      const entityDeleted = await this.repository.deleteById(id);
      if (!entityDeleted) {
        throw ServerException.NotFoundException();
      }

      return Promise.resolve(this.normalize(entityDeleted) as T);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  protected abstract normalize(entity: T | T[]): T | T[];
}
