import { SupportedChainIds } from './types';
import injectedModule from '@web3-onboard/injected-wallets';
import { init } from '@web3-onboard/react';

const injected = injectedModule(); // 브라우저에 설치되어 있는 wallet 가져오기 (다른 wallet도 가져올 수 있다고 함)

const wallets = [injected];

// 프로젝트에 사용할 체인 등록 (여러개 등록 가능)
const chains = [
  {
    id: SupportedChainIds.SEPOLIA_TESTNET,
    token: 'ETH',
    label: 'Sepolia Testnet',
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
  },
];

// 웹페이지 관련 정보 등록
const appMetadata = {
  name: 'BV-2024-Dashboard',
  icon: '<svg>My App Icon</svg>',
  description: 'Dashboard toy project for 2024-1',
  recommendedInjectedWallets: [{ name: 'MetaMask', url: 'https://metamask.io' }],
};

// 위 정보들을 바탕으로 web3Onboard인스턴스 생성
export const web3Onboard = init({
  wallets,
  chains,
  appMetadata,
  connect: {
    autoConnectLastWallet: true,
    showSidebar: false,
  },
});
