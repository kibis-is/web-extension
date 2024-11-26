/**
 * @property {string} currentBlockTime - The current block time (in milliseconds). A negative value indicates an invalid
 * value.
 * @property {string} fee - The suggested transaction fee, in atomic units.
 * @property {string} minFee - The minimum transaction fee, in atomic units, (not per byte) required for the
 * txn to validate for the current network protocol.
 * @property {string} lastSeenBlock - The last block seen. A negative value indicates an invalid value.
 * @property {number} updatedAt - A timestamp (in milliseconds) for when thw network was last queried.
 */
interface ITransactionParams {
  currentBlockTime: string;
  fee: string;
  lastSeenBlock: string;
  minFee: string;
  updatedAt: number;
}

export default ITransactionParams;
