// types
import type IAVMApplication from './IAVMApplication';

interface IAVMSearchApplicationsResult {
  applications: IAVMApplication[];
  ['current-round']: bigint;
  ['next-token']?: string;
}

export default IAVMSearchApplicationsResult;
