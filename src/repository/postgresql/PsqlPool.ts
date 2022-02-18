import { Pool } from 'pg';

const PsqlPool = (): Pool => {
  const psqlConfig = {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  };
  return new Pool(psqlConfig);
};

export { PsqlPool };
