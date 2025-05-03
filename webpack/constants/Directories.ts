import { resolve } from 'path';

export const CHROME_BUILD_PATH = resolve(process.cwd(), '.chrome_build');
export const DAPP_EXAMPLE_BUILD_PATH = resolve(
  process.cwd(),
  '.dapp_example_build'
);
export const DAPP_EXAMPLE_SRC_PATH = resolve(process.cwd(), 'dapp-example');
export const EDGE_BUILD_PATH = resolve(process.cwd(), '.edge_build');
export const FIREFOX_BUILD_PATH = resolve(process.cwd(), '.firefox_build');
export const OPERA_BUILD_PATH = resolve(process.cwd(), '.opera_build');
export const SRC_PATH = resolve(process.cwd(), 'src');
