// repositories
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';

// types
import type { IAccount } from '@extension/types';

/**
 * Determines if a given account is a watch account. A watch account is determined by whether it has a passkey or
 * private key associated with it.
 * @param {IAccount} account - The account.
 * @returns {boolean} true if the account is a watch account, false otherwise.
 */
export default async function isWatchAccount(
  account: IAccount
): Promise<boolean> {
  // if there is a passkey associated with account, it is no a watch account
  if (!!account.passkey) {
    return false;
  }

  // if there is no private key stored, it is a watch account
  return !(await new PrivateKeyRepository().fetchByPublicKey(
    account.publicKey
  ));
}
