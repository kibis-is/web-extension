// types
import type IAVMStateSchema from './IAVMStateSchema';
import type IAVMTealKeyValue from './IAVMTealKeyValue';

interface IAVMApplicationParams {
  ['approval-program']: string;
  ['clear-state-program']: string;
  creator?: string;
  ['extra-program-pages']?: bigint;
  ['global-state']?: IAVMTealKeyValue[];
  ['global-state-schema']?: IAVMStateSchema;
  ['local-state-schema']?: IAVMStateSchema;
}

export default IAVMApplicationParams;
