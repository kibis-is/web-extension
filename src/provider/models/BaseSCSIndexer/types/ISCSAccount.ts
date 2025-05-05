interface ISCSAccount {
  contractAddress: string;
  contractId: number;
  createRound: number;
  creator: string;
  deleted: number | null;
  global_deadline: number;
  global_delegate: string;
  global_deployer: string;
  global_distribution_count: number;
  global_distribution_seconds: number;
  global_funder: string;
  global_funding: string | null;
  global_initial: string;
  global_lockup_delay: number;
  global_messenger_id: number;
  global_owner: string;
  global_parent_id: number;
  global_period: number;
  global_period_limit: number;
  global_period_seconds: number;
  global_total: string;
  global_vesting_delay: number;
  lastSyncRound: number;
  part_sel_k: string | null;
  part_sp_key: string | null;
  part_vote_fst: number | null;
  part_vote_k: string | null;
  part_vote_kd: number | null;
  part_vote_lst: number | null;
}

export default ISCSAccount;
