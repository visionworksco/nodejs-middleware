import bcrypt from 'bcrypt';
import { ServerException } from '../../server/express/exception/ServerException';
import { StatusCode } from '../../status/StatusCode';

export class PasswordService {
  static hashSync(password: string): string {
    try {
      return bcrypt.hashSync(password, 10);
    } catch (error) {
      throw ServerException.create(
        StatusCode.INTERNAL_SERVER_ERROR,
        error instanceof Error ? error.message : '',
      );
    }
  }

  static async hash(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  static async compare(password: string, passwordHashed: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, passwordHashed);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
