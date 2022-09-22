import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './auth/auth.module';
import { FilemanagerModule } from './filemanager/filemanager.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //Como esta definido como global este modulo puede ser accedido sin necesidad de importarlo en otro modulo.
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'production').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        EXPIRES_IN: Joi.number().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'production',
      // logging: process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    FilemanagerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
