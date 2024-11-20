import { useState } from 'react';

// errors
import { InvalidAccountTypeError } from '@extension/errors';

// managers
import PasskeyAccountManager from '@extension/managers/PasskeyAccountManager';

// selectors
import { useSelectLogger } from '@extension/selectors';

// types
import type { ISignTransactionState } from '@extension/types';
import type {
  ISignTransactionsWithPasskeyActionOptions,
  IState,
} from './types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';

export default function useSignTransactionsWithPasskey(): IState {
  const _hookName = 'useSignTransactionsWithPasskey';
  // hooks
  const logger = useSelectLogger();
  // state
  const [signTransactionStates, setSignTransactionStates] = useState<
    ISignTransactionState[]
  >([]);
  // actions
  const signTransactionsWithPasskeyAction = async ({
    signer,
    transactions,
  }: ISignTransactionsWithPasskeyActionOptions) => {
    let _error: string;
    let signedTransaction: Uint8Array;
    let signedTransactions: Uint8Array[] = [];

    if (!signer.passkey) {
      _error = `account "${convertPublicKeyToAVMAddress(
        signer.publicKey
      )}" does not have a passkey associated with it`;

      logger.error(`${_hookName}: `, _error);

      throw new InvalidAccountTypeError(_error);
    }

    setSignTransactionStates(
      transactions.map((value) => ({
        signed: false,
        txnID: value.txID(),
      }))
    );

    // for each transaction, call the passkey to sign
    for (const transaction of transactions) {
      signedTransaction = await PasskeyAccountManager.signTransaction({
        logger,
        signer,
        transaction,
      });

      setSignTransactionStates((prevState) =>
        prevState.map((value) =>
          value.txnID === transaction.txID()
            ? { ...value, signed: true }
            : value
        )
      );

      signedTransactions.push(signedTransaction);
    }

    logger.debug(
      `${_hookName}: signed "${signedTransactions.length}" using the passkey`
    );

    return signedTransactions;
  };
  const reset = () => {
    setSignTransactionStates([]);
  };

  return {
    reset,
    signTransactionStates,
    signTransactionsWithPasskeyAction,
  };
}
