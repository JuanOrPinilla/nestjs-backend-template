/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;
}
