import { IsString } from 'class-validator';

export class CreateCatagoryDto {
  @IsString()
  title: string;

  @IsString()
  describtion: string;
}
