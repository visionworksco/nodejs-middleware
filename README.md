# @visionworksco/nodejs-middleware

Node.js middleware supporting common operation with:

- REST API
- MongoDB
- PostgreSQL
- RabbitMQ
- File upload / dowload
- User authentication / authorization / access roles
- Exception handler
- Logging
- Utils

## Code example

```
// Account.ts
import { AuthUser } from '@visionworksco/nodejs-middleware';

export interface Account extends AuthUser {
name: string;
groups?: string[];
permissions?: string[];
}
```

```
// AccountEntity.ts
import { Exclude, Expose } from 'class-transformer';
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseApiEntity } from '../../entity/BaseApiEntity';
import { Account } from './Account';

export class AccountEntity extends BaseApiEntity implements Account {
@Expose()
@IsEmail()
email = '';

@Expose()
@Exclude({ toPlainOnly: true })
@IsString()
password = '';

@Expose()
@IsString()
@IsNotEmpty()
name = '';

@Expose()
@IsOptional()
@IsArray()
@IsString({ each: true })
@IsNotEmpty({ each: true })
groups?: string[] = [];

@Expose()
@IsOptional()
@IsArray()
@IsString({ each: true })
@IsNotEmpty({ each: true })
permissions?: string[] = [];

@Expose()
@IsOptional()
@IsArray()
@IsString({ each: true })
@IsNotEmpty({ each: true })
roles?: string[] = [];
}
```

```
// AccountRoute.ts
import { BaseCrudRoute } from '@visionworksco/nodejs-middleware';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Authenticate } from '../../server/express/middleware/Authenticate';
import { ChartWidgetController } from '../chartWidget/ChartWidgetController';
import { AccountController } from './AccountController';
import { AccountEntity } from './AccountEntity';

export class AccountRoute extends BaseCrudRoute<AccountEntity> {
  private accountController: AccountController;

  constructor(accountController: AccountController) {
    super(accountController);
    this.accountController = accountController;
    this.registerCustomRoutes();
  }

  getBaseUrl(): string {
    return '/accounts';
  }

  protected allMutateHandlers = (handlerId?: string): RequestHandler[] => [
    Authenticate(), // expressjs middleware
    this.allMutate,
  ];

  private registerCustomRoutes() {
    this.router.get(`${this.getBaseUrl()}/email/:email`, [this.findByEmail]);
  }

  private findByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.accountController.findByEmail(req, res);
    } catch (error) {
      next(error);
    }
  };
}
```

```
// AccountController.ts
import { BaseRequest, BaseResult, StatusCode } from '@visionworksco/nodejs-middleware';
import { Response } from 'express';
import { BaseApiCrudController } from '../../controller/BaseApiCrudController';
import { AccountEntity } from './AccountEntity';
import { AccountService } from './AccountService';

export class AccountController extends BaseApiCrudController<AccountEntity> {
  private accountService: AccountService;

  constructor(accountService: AccountService) {
    super(accountService, AccountEntity);
    this.accountService = accountService;
  }

  async findByEmail(req: BaseRequest, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const entity = await this.accountService.findByEmail(email);

      const response = new BaseResult(entity);
      res.status(StatusCode.OK).json(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
```

```
// AccountService.ts
import { BaseApiCrudService } from '../../service/BaseApiCrudService';
import { AccountEntity } from './AccountEntity';
import { AccountRepository } from './AccountRepository';

export class AccountService extends BaseApiCrudService<AccountEntity> {
  private accountRepository: AccountRepository;

  constructor(repository: AccountRepository) {
    super(repository);
    this.accountRepository = repository;
  }

  async findByEmail(email: string): Promise<AccountEntity> {
    try {
      const entity = await this.accountRepository.findByEmail(email);
      return Promise.resolve(this.normalize(entity) as AccountEntity);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findIdByEmail(email: string): Promise<string | undefined> {
    try {
      const entity = await this.findByEmail(email);
      return Promise.resolve(entity.id);
    } catch (error) {
      return Promise.resolve(undefined);
    }
  }
}
```

```
// AccountRepository.ts
import { PageRequest, PageResult, ServerException } from '@visionworksco/nodejs-middleware';
import { Pool } from 'pg';
import { BaseApiPsqlRepository } from '../../repository/postgresql/BaseApiPsqlRepository';
import { SqlTable } from '../../repository/postgresql/SqlTable';
import { AccountEntity } from './AccountEntity';

export class AccountRepository extends BaseApiPsqlRepository<AccountEntity> {
  constructor(psql: Pool) {
    super(psql, SqlTable.ACCOUNT, AccountEntity);
  }

  async findAll(pageRequest: PageRequest): Promise<PageResult<AccountEntity>> {
    throw ServerException.NotImplementedException();
  }

  async findById(id: string): Promise<AccountEntity> {
    throw ServerException.NotImplementedException();
  }

  async findByEmail(email: string): Promise<AccountEntity> {
    try {
      const query: Partial<AccountEntity> = { email };
      const entity = await this.findOne(query);
      return Promise.resolve(entity);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteById(id: string): Promise<AccountEntity> {
    throw ServerException.NotImplementedException();
  }
}
```

```
// server.ts
private accountRepository: AccountRepository;
private accountService: AccountService;
private accountController: AccountController;
private accountRoute: AccountRoute;

...

this.accountRepository = new AccountRepository(psqlPool);
this.accountService = new AccountService(this.accountRepository);
this.accountController = new AccountController(this.accountService);
this.accountRoute = new AccountRoute(this.accountController, this.chartWidgetController);

```

## Publish a new release

- nvm ls, nvm use <node_version>
- npm login (one time)
- npm run compile
- npm run build
- npm run commit
- npm run release:[first|major|minor|patch]
- npm run npm:publish

## Symlink the package

### Create / remove a npm link

- npm link
- npm unlink

### Install / uninstall the symlinked package in a project

- npm link @visionworksco/nodejs-middleware
- npm unlink --no-save @visionworksco/nodejs-middleware
