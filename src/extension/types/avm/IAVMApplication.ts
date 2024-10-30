// types
import type IAVMApplicationParams from './IAVMApplicationParams';

interface IAVMApplication {
  ['created-at-round']?: bigint;
  deleted?: boolean;
  ['destroyed-at-round']: bigint;
  id: bigint;
  params: IAVMApplicationParams;
}

export default IAVMApplication;
