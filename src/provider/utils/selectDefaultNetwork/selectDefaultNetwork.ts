// enums
import { NetworkTypeEnum } from '@provider/enums';

// types
import type { INetwork } from '@provider/types';

/**
 * Convenience function that simply gets the default network, either the first stable network, or the first network in
 * the list.
 * @param {<T extends INetwork>[]} networks - a list of networks to select the default network from.
 * @returns {<T extends INetwork>} the default network.
 */
export default function selectDefaultNetwork<T extends INetwork>(networks: T[]): T {
  return networks.find((value) => value.type === NetworkTypeEnum.Stable) || networks[0];
}
