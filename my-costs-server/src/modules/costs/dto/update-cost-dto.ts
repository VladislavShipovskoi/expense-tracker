import { IsNotEmpty } from 'class-validator';

export class UpdateCostDto {
  @IsNotEmpty() readonly text: string;
  @IsNotEmpty() readonly sum: number;
  @IsNotEmpty() readonly date: Date;
}
