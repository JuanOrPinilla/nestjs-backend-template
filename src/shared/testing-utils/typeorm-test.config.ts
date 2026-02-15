/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';

export const getTypeOrmTestModule = () =>
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    synchronize: true,
    entities: [],
  });

export const getTypeOrmTestFeature = () =>
  TypeOrmModule.forFeature([]);