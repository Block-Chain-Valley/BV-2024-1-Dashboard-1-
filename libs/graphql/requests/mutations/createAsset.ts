import { GQLOptions } from '../../gql-client.type';
import { gql } from '../__generated__/index';
import { useMutation } from '@apollo/client';

export const createAsset = gql(/* GraphQL */ `
  mutation CreateAsset($input: CreateAssetInput!) {
    createAsset(input: $input) {
      id
      address
      token {
        name
        symbol
        decimal
      }
      nft {
        name
        symbol
        baseURL
      }
    }
  }
`);

export const useCreateAsset = (options?: GQLOptions<typeof createAsset>) => {
  return useMutation(createAsset, {
    ...options,
  });
};
