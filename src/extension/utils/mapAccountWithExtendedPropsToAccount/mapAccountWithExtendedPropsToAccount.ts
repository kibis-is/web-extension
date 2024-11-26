// enums
import { DelimiterEnum } from '@extension/enums';

// types
import type { IAccount, IAccountWithExtendedProps } from '@extension/types';

/**
 * Convenience function that simply converts an account with extended props object to an account object that is used in
 * storage. It omits the unused props.
 * @param {IAccountWithExtendedProps} accountWithExtendedProps - an account object with extended props.
 * @returns {IAccount} the account object without the extended props.
 */
export default function mapAccountWithExtendedPropsToAccount({
  color,
  createdAt,
  groupID,
  groupIndex,
  icon,
  id,
  name,
  networkInformation,
  networkStakingApps,
  networkTransactions,
  index,
  publicKey,
  updatedAt,
}: IAccountWithExtendedProps): IAccount {
  return {
    _delimiter: DelimiterEnum.Account,
    color,
    createdAt,
    groupID,
    groupIndex,
    icon,
    id,
    name,
    networkInformation,
    networkStakingApps,
    networkTransactions,
    index,
    publicKey,
    updatedAt,
  };
}
