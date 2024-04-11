import { DIRECTION } from '../enums/direction.enum';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '트랜잭션' })
export class Transaction {
  @Field(() => ID, { nullable: false, description: '트랜잭션 아이디' })
  id!: string;

  @Field(() => String, { nullable: false, description: '트랜잭션 해시' })
  transactionHash!: string;

  @Field(() => String, { nullable: false, description: '사용자 아이디' })
  userId!: string;

  @Field(() => String, { nullable: false, description: '거래 대상' })
  targetAddress!: string;

  @Field(() => DIRECTION, {
    nullable: false,
    description: '입금 또는 출금 여부',
  })
  direction!: keyof typeof DIRECTION;

  @Field(() => String, { nullable: false, description: '자산 주소' })
  address!: string;

  @Field(() => String, { nullable: false, description: '트랜잭션 자산 수량' })
  amount!: string;

  @Field(() => Int, { nullable: false, description: '발생 타임스탬프' })
  timestamp!: number;

  @Field(() => Date, { nullable: false, description: '생성 일시' })
  createdAt!: Date;

  @Field(() => Date, { nullable: false, description: '수정 일시' })
  updatedAt!: Date;
}
