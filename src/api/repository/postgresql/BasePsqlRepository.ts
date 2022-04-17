import { Pool } from 'pg';
import { PageRequest } from '../../pagination/PageRequest';
import { PageResult } from '../../pagination/PageResult';
import { Paginator } from '../../pagination/Paginator';
import { ServerException } from '../../server/express/exception/ServerException';
import { StatusCode } from '../../status/StatusCode';
import { StatusCodeReason } from '../../status/StatusCodeReason';
import { Repository } from '../Repository';
import { PsqlUtils } from './PsqlUtils';

export abstract class BasePsqlRepository<T> implements Repository<T> {
  protected psql: Pool;
  protected tableName: string;

  constructor(psql: Pool, tableName: string) {
    this.psql = psql;
    this.tableName = tableName;
  }

  async findAll(pageRequest: PageRequest): Promise<PageResult<T>> {
    try {
      // TODO: query, sort ASC | DESC
      const { query, sort, page, pageLimit } = pageRequest;

      const responseCount = await this.psql.query<{ count: string }>(
        `SELECT COUNT(*) FROM ${this.tableName}`,
      );
      const rowsCount = responseCount.rows;
      if (rowsCount.length === 0) {
        throw ServerException.create(
          StatusCode.INTERNAL_SERVER_ERROR,
          StatusCodeReason.INTERNAL_SERVER_ERROR,
        );
      }
      const rowCount = rowsCount[0];
      const collectionSize = Number(rowCount.count);

      const paginator = new Paginator(page, pageLimit, collectionSize);

      let sqlQuery = `SELECT * FROM ${this.tableName}` + (sort ? ` ORDER BY "${sort}"` : ``);
      sqlQuery += ` LIMIT ${paginator.pageSizeLimit} OFFSET ${paginator.getSkipCount()}`;
      const response = await this.psql.query<T>(sqlQuery);

      const rows = response.rows;

      paginator.pageSize = rows.length;

      const rowsUpdated = this.normalize(rows) as T[];
      const result = new PageResult(rowsUpdated, paginator);
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findById(id: string): Promise<T> {
    try {
      const response = await this.psql.query<T>(`SELECT * FROM ${this.tableName} WHERE "id" = $1`, [
        id,
      ]);

      const rows = response.rows;
      if (rows.length === 0) {
        throw ServerException.create(StatusCode.NOT_FOUND, StatusCodeReason.NOT_FOUND);
      }

      const row = rows[0];
      const rowUpdated = this.normalize(row) as T;
      return Promise.resolve(rowUpdated);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findOne(query: Partial<T>): Promise<T> {
    try {
      const keysWithValues = PsqlUtils.getKeysWithValues(query);
      const response = await this.psql.query<T>(
        `SELECT * FROM ${this.tableName} WHERE ${keysWithValues}`,
      );

      const rows = response.rows;
      if (rows.length === 0) {
        throw ServerException.create(StatusCode.NOT_FOUND, StatusCodeReason.NOT_FOUND);
      }

      const row = rows[0];
      const rowUpdated = this.normalize(row) as T;
      return Promise.resolve(rowUpdated);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async save(entity: T): Promise<T> {
    try {
      const { keys, keysOrdered, values } = PsqlUtils.getOrderedKeysWithValues(entity);
      const response = await this.psql.query<T>(
        `INSERT INTO ${this.tableName}(${keys}) VALUES(${keysOrdered}) RETURNING *`,
        values,
      );

      const rows = response.rows;
      if (rows.length === 0) {
        throw ServerException.create(
          StatusCode.INTERNAL_SERVER_ERROR,
          StatusCodeReason.INTERNAL_SERVER_ERROR,
        );
      }

      const row = rows[0];
      const rowUpdated = this.normalize(row) as T;
      return Promise.resolve(rowUpdated);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateById(id: string, query: Partial<T>): Promise<T> {
    try {
      const keysWithValues = PsqlUtils.getKeysWithValues(query);
      const response = await this.psql.query<T>(
        `UPDATE ${this.tableName} SET ${keysWithValues} WHERE "id" = $1 RETURNING *`,
        [id],
      );

      const rows = response.rows;
      if (rows.length === 0) {
        throw ServerException.create(StatusCode.NOT_FOUND, StatusCodeReason.NOT_FOUND);
      }

      const row = rows[0];
      const rowUpdated = this.normalize(row) as T;
      return Promise.resolve(rowUpdated);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteById(id: string): Promise<T> {
    try {
      const response = await this.psql.query<T>(
        `DELETE FROM ${this.tableName} WHERE "id" = $1 RETURNING *`,
        [id],
      );

      const rows = response.rows;
      if (rows.length === 0) {
        throw ServerException.create(
          StatusCode.INTERNAL_SERVER_ERROR,
          StatusCodeReason.INTERNAL_SERVER_ERROR,
        );
      }

      const row = rows[0];
      const rowUpdated = this.normalize(row) as T;
      return Promise.resolve(rowUpdated);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  protected abstract normalize(dbResult: T | T[] | null | null): T | T[];
}
