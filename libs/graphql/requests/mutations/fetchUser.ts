import { GQLOptions } from '../../gql-client.type';
import { gql } from '../__generated__/index';
import { useMutation } from '@apollo/client';

export const fetchUser = gql(/* GraphQL */ `
  mutation FetchUser($input: UserInput!) {
    fetchUser(input: $input) {
      address
      createdAt
      id
      lastUpdatedBlockNumber
      updatedAt
      transactions {
        address
        asset {
          address
          token {
            name
            symbol
          }
          nft {
            name
            symbol
          }
        }
        amount
        timestamp
        direction
        id
        targetAddress
        transactionHash
        userId
      }
      userAssetBalances {
        asset {
          address
          token {
            name
            symbol
          }
          nft {
            name
            symbol
          }
        }
        balance
      }
    }
  }
`);

export const useFetchUser = (options?: GQLOptions<typeof fetchUser>) => {
  return useMutation(fetchUser, {
    ...options,
  });
};
