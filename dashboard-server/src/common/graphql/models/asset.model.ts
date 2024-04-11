import { ASSET_TYPE } from '../enums/asset-type.enum';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '자산' })
export class Asset {
  @Field(() => String, { nullable: false, description: '자산 아이디' })
  id!: string;

  @Field(() => String, { nullable: false, description: '주소' })
  address!: string;

  @Field(() => Date, { nullable: false, description: '생성 일시' })
  createdAt!: Date;

  @Field(() => Date, { nullable: false, description: '수정 일시' })
  updatedAt!: Date;

  @Field(() => ASSET_TYPE, { nullable: false, description: '자산 타입' })
  type: keyof typeof ASSET_TYPE;
}
