/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: process.env.TYPE as 'postgres',
    host: process.env.HOST,
    port: parseInt(process.env.PORT as string),
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE as string,
    entities: [],
    synchronize: true,
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
