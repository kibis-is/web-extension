// repositories
import AccountRepository from '@provider/repositories/AccountRepository';

// types
import type { IAccount } from '@provider/types';

// services
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';

export default function isAccountKnown(accounts: IAccount[], address: string): boolean {
  return (
    accounts.findIndex((value) => convertPublicKeyToAVMAddress(AccountRepository.decode(value.publicKey)) === address) >
    -1
  );
}
