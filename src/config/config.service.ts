import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// eslint-disable-next-line
require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];

    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const env = this.getValue('NODE_ENV', false);
    return env === 'production';
  }

  public isMigration() {
    const env = this.getValue('NODE_ENV', false);
    return env === 'migration';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    const baseConfig: Partial<TypeOrmModuleOptions> = {
      type: 'postgres',

      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),

      entities: ['dist/**/*.entity.js'],

      ssl: this.isProduction(),
    };

    if (!this.isMigration()) return baseConfig;

    return {
      ...baseConfig,
      migrationsTableName: 'migration',
      migrations: ['src/migration/*{.js,.ts}'],
      cli: {
        migrationsDir: 'src/migration',
      },
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
]);

export { configService };
