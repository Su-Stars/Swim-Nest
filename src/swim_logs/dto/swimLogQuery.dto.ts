import { IsInt, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

// 연도(4자리) 와 월(1~12) 는 필수. 그리고 날짜는 선택(1 ~ 31)
export class SwimLogQueryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  year : number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  month : number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  day : number;
}