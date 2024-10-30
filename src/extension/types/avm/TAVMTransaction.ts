// types
import type IAVMApplicationTransaction from './IAVMApplicationTransaction';
import type IAVMAssetConfigTransaction from './IAVMAssetConfigTransaction';
import type IAVMAssetFreezeTransaction from './IAVMAssetFreezeTransaction';
import type IAVMAssetTransferTransaction from './IAVMAssetTransferTransaction';
import type IAVMKeyRegistrationTransaction from './IAVMKeyRegistrationTransaction';
import type IAVMPaymentTransaction from './IAVMPaymentTransaction';

interface IBaseAVMTransaction {
  ['auth-addr']?: string;
  ['close-rewards']?: bigint;
  ['confirmed-round']?: bigint;
  fee: bigint;
  ['first-valid']: bigint;
  ['genesis-hash']?: string;
  ['genesis-id']?: string;
  group?: string;
  id?: string;
  ['inner-txns']?: TAVMTransaction[];
  ['last-valid']: bigint;
  lease?: string;
  note?: string;
  ['rekey-to']?: string;
  ['round-time']?: bigint;
  sender: string;
}

type TAVMTransactions =
  | {
      ['asset-config-transaction']: IAVMAssetConfigTransaction;
      ['tx-type']: 'acfg';
    }
  | {
      ['asset-freeze-transaction']: IAVMAssetFreezeTransaction;
      ['tx-type']: 'afrz';
    }
  | {
      ['application-transaction']: IAVMApplicationTransaction;
      ['tx-type']: 'appl';
    }
  | {
      ['asset-transfer-transaction']: IAVMAssetTransferTransaction;
      ['tx-type']: 'axfer';
    }
  | {
      ['keyreg-transaction']: IAVMKeyRegistrationTransaction;
      ['tx-type']: 'keyreg';
    }
  | {
      ['payment-transaction']: IAVMPaymentTransaction;
      ['tx-type']: 'pay';
    };

type TAVMTransaction = IBaseAVMTransaction & TAVMTransactions;

export default TAVMTransaction;
