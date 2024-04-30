export enum TabType {
  TOKEN = 'TOKEN',
  NFT = 'NFT',
}

export enum WalletType {
  METAMASK = 'METAMASK',
  COINBASE = 'COINBASE',
  OTHERS = 'OTHERS',
}

export enum SupportedChainIds {
  SEPOLIA_TESTNET = '0xaa36a7',
  UNSUPPORTED = 'UNSUPPORTED',
}

export enum TokenTransferStatus {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
}

export enum NoticeType {
  ASSET_WALLET_NOT_CONNECTED = 'ASSET_WALLET_NOT_CONNECTED',
  TRANSACTION_WALLET_NOT_CONNECTED = 'TRANSACTION_WALLET_NOT_CONNECTED',
  NO_TRANSACTION = 'NO_TRANSACTION',
}

export enum COOKIE_KEY {
  WALLET_ADDRESS = 'WALLET_ADDRESS',
  CHAIN_ID = 'CHAIN_ID',
}

export enum AddAssetModalStatus {
  DEFAULT = 'DEFAULT',
  FETCHING = 'FETCHING',
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_ADDED = 'ALREADY_ADDED',
  AVAILABLE = 'AVAILABLE',
}

export enum SendStatusType {
  CONFIRM = 'CONFIRM',
  SEND = 'SEND',
  ARRIVE = 'ARRIVE',
}

export enum SendProgressState {
  WAITING = 'WAITING',
  PROGRESS = 'PROGRESS',
  ERROR = 'ERROR',
}

export type SendStatusToProgress = Record<SendStatusType, SendProgressState>;

export enum SendInputErrorType {
  NONE = 'NONE',
  INSUFFICIENT_GAS_FEE = 'INSUFFICIENT_GAS_FEE',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  MY_WALLET = 'MY_WALLET',
}
