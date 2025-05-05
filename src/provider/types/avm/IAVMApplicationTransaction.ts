// types
import type IAVMStateSchema from './IAVMStateSchema';

interface IAVMApplicationTransaction {
  accounts?: string[];
  ['application-args']?: string[];
  ['application-id']: bigint;
  ['approval-program']?: string;
  ['clear-state-program']?: string;
  ['extra-program-pages']?: bigint;
  ['foreign-apps']?: bigint[];
  ['foreign-assets']?: bigint[];
  ['global-state-schema']?: IAVMStateSchema;
  ['local-state-schema']?: IAVMStateSchema;
  ['on-completion']: 'clear' | 'closeout' | 'delete' | 'noop' | 'optin' | 'update';
}

export default IAVMApplicationTransaction;
