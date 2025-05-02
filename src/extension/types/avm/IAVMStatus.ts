/**
 * @property {string} catchpoint - [optional] The current catchpoint that is being caught up to.
 * @property {bigint} catchpoint-acquired-blocks - [optional] The number of blocks that have already been obtained by the node as part of the catchup.
 * @property {bigint} catchpoint-processed-accounts - [optional] The number of accounts from the current catchpoint that have been processed so far as part of the catchup.
 * @property {bigint} catchpoint-processed-kvs - [optional] The number of key-values (KVs) from the current catchpoint that have been processed so far as part of the catchup.
 * @property {bigint} catchpoint-total-accounts - [optional] The total number of accounts included in the current catchpoint.
 * @property {bigint} catchpoint-total-blocks - [optional] The total number of blocks that are required to complete the current catchpoint catchup.
 * @property {bigint} catchpoint-total-kvs - [optional] The total number of key-values (KVs) included in the current catchpoint.
 * @property {bigint} catchpoint-verified-accounts - [optional] The number of accounts from the current catchpoint that have been verified so far as part of the catchup.
 * @property {bigint} catchpoint-verified-kvs - [optional] The number of key-values (KVs) from the current catchpoint that have been verified so far as part of the catchup.
 * @property {bigint} catchup-time - CatchupTime in nanoseconds.
 * @property {string} last-catchpoint - [optional] The last catchpoint seen by the node.
 * @property {bigint} last-round - LastRound indicates the last round seen.
 * @property {string} last-version - LastVersion indicates the last consensus version supported.
 * @property {string} next-version - NextVersion of consensus protocol to use.
 * @property {bigint} next-version-round - NextVersionRound is the round at which the next consensus version will apply.
 * @property {boolean} next-version-supported - Indicates whether the next consensus version is supported by this node.
 * @property {boolean} stopped-at-unsupported-round - Indicates that the node does not support the new rounds and has stopped making progress.
 * @property {bigint} time-since-last-round - TimeSinceLastRound in nanoseconds.
 * @property {bigint} upgrade-delay - [optional] Upgrade delay.
 * @property {bigint} upgrade-next-protocol-vote-before - [optional] Next protocol round.
 * @property {bigint} upgrade-no-votes - [optional] No votes cast for consensus upgrade.
 * @property {boolean} upgrade-node-vote - [optional] This node's upgrade vote.
 * @property {bigint} upgrade-vote-rounds - [optional] Total voting rounds for current upgrade.
 * @property {bigint} upgrade-votes - [optional] Total votes cast for consensus upgrade.
 * @property {bigint} upgrade-votes-required - [optional] Yes votes required for consensus upgrade.
 * @property {bigint} upgrade-yes-votes - [optional] Yes votes cast for consensus upgrade.
 */
interface AVMStatus {
  catchpoint?: string;
  ['catchpoint-acquired-blocks']?: bigint;
  ['catchpoint-processed-accounts']?: bigint;
  ['catchpoint-processed-kvs']?: bigint;
  ['catchpoint-total-accounts']?: bigint;
  ['catchpoint-total-blocks']?: bigint;
  ['catchpoint-total-kvs']?: bigint;
  ['catchpoint-verified-accounts']?: bigint;
  ['catchpoint-verified-kvs']?: bigint;
  ['catchup-time']: bigint;
  ['last-catchpoint']?: string;
  ['last-round']: bigint;
  ['last-version']: string;
  ['next-version']: string;
  ['next-version-round']: bigint;
  ['next-version-supported']: boolean;
  ['stopped-at-unsupported-round']: boolean;
  ['time-since-last-round']: bigint;
  ['upgrade-delay']?: bigint;
  ['upgrade-next-protocol-vote-before']?: bigint;
  ['upgrade-no-votes']?: bigint;
  ['upgrade-node-vote']?: boolean;
  ['upgrade-vote-rounds']?: bigint;
  ['upgrade-votes']?: bigint;
  ['upgrade-votes-required']?: bigint;
  ['upgrade-yes-votes']?: bigint;
}

export default AVMStatus;
