import {
  ModalContextChildren,
  ModalContextType,
  UserAssets,
  UserAssetsContextType,
  UserTransactions,
  UserTransactionsContextType,
  WalletContextType,
} from './GlobalContext.d';
import type { WalletState } from '@web3-onboard/core';
import { useConnectWallet } from '@web3-onboard/react';
import { createContext, useEffect, useState } from 'react';

export const ModalContext = createContext<ModalContextType>([null, () => null]);
export const ToastContext = createContext<ModalContextType>([null, () => null]);
export const WalletContext = createContext<WalletContextType>({
  wallet: null,
  connecting: false,
  connect: () => new Promise<WalletState[]>(() => null),
  disconnect: () => new Promise<WalletState[]>(() => null),
});
export const UserAssetsContext = createContext<UserAssetsContextType>([[], () => null]);
export const UserTransactionsContext = createContext<UserTransactionsContextType>([[], () => null]);

export default function GlobalStateContext(props: { children: React.ReactNode | null }) {
  const [modalContext, setModalContext] = useState<ModalContextChildren>(null);
  const [toastContext, setToastContext] = useState<ModalContextChildren>(null);
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [userAssets, setUserAssets] = useState<UserAssets>([]);
  const [userTransactions, setUserTransactions] = useState<UserTransactions>([]);

  return (
    <WalletContext.Provider value={{ wallet, connecting, connect, disconnect }}>
      <ModalContext.Provider value={[modalContext, setModalContext]}>
        <ToastContext.Provider value={[toastContext, setToastContext]}>
          <UserAssetsContext.Provider value={[userAssets, setUserAssets]}>
            <UserTransactionsContext.Provider value={[userTransactions, setUserTransactions]}>
              {props.children}
            </UserTransactionsContext.Provider>
          </UserAssetsContext.Provider>
        </ToastContext.Provider>
      </ModalContext.Provider>
    </WalletContext.Provider>
  );
}
