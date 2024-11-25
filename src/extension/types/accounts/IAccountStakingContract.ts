/**
 * @property {string} availableBalance - This is the balance that is available to withdraw immediately.
 * @property {string} balance - This is the total balance in the contract.
 * @property {string} id - The app ID of the contract.
 * @property {string} lockupStartedAt - The timestamp (in milliseconds) for when the lockup started.
 * @property {number} lockupYears - The number of years lockup for the contract.
 * @property {number} publicKey - The public key of the contract.
 * @property {'offline' | 'online'} status - Whether the contract is participating in online staking.
 * @property {string | null} participationKeyExpiresAt - The timestamp (in milliseconds) for when the participation key
 * expires. If the contract is "offline", this will be null.
 */
interface IAccountStakingContract {
  availableBalance: string;
  balance: string;
  id: string;
  lockupStartedAt: string;
  lockupYears: number;
  publicKey: string;
  status: 'offline' | 'online';
  participationKeyExpiresAt: string | null;
}

export default IAccountStakingContract;
