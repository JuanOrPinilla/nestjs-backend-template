/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;
}

export class PatchTaskDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;
}
