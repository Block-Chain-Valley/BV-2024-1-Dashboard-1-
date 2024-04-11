import Main from '@/components/layouts/Main';
import { web3Onboard } from '@/libs/web3-onboard.config';
import GlobalStateContext from '@/store/GlobalContext';
import '@/styles/_fonts.scss';
import '@/styles/_reset.scss';
import '@/styles/colors.scss';
import { ApolloProvider } from '@apollo/client';
import { useGraphqlClient } from '@graphql/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Web3OnboardProvider } from '@web3-onboard/react';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  const client = useGraphqlClient();
  const queryClient = new QueryClient();

  return (
    <>
      <ApolloProvider client={client}>
        <Web3OnboardProvider web3Onboard={web3Onboard}>
          <QueryClientProvider client={queryClient}>
            <GlobalStateContext>
              <Main>
                <Component {...pageProps} />
              </Main>
            </GlobalStateContext>
          </QueryClientProvider>
        </Web3OnboardProvider>
      </ApolloProvider>
    </>
  );
}
