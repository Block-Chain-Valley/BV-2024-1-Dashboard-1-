import { ASSET_TYPE } from '../enums/asset-type.enum';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsEthereumAddress, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateAssetInput {
  @Field(() => String, { nullable: false, description: '지갑 주소' })
  @IsEthereumAddress()
  @MaxLength(256)
  userWalletAddress!: string;

  @Field(() => String, { nullable: false, description: '자산 주소' })
  @IsEthereumAddress()
  @MaxLength(256)
  address!: string;

  @Field(() => ASSET_TYPE, { nullable: false, description: '자산 타입' })
  @IsEnum(ASSET_TYPE)
  type!: keyof typeof ASSET_TYPE;

  @Field(() => String, { nullable: false, description: '자산 이름' })
  @IsString()
  name: string;

  @Field(() => String, { nullable: false, description: '자산 심볼' })
  @IsString()
  symbol: string;

  @Field(() => Int, { nullable: true, description: '자산 소수점 자리수' })
  @IsOptional()
  @IsInt()
  decimal?: number;

  @Field(() => Int, { nullable: true, description: '자산 데이터 URL' })
  @IsOptional()
  @IsInt()
  baseURL?: string;

  @Field(() => String, { nullable: false, description: '자산 심볼' })
  @IsString()
  balance: string;
}
