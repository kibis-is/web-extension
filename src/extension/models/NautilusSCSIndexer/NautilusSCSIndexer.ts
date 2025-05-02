// models
import BaseSCSIndexer from '@extension/models/BaseSCSIndexer';

// types
import type { TPartialExcept } from '@common/types';
import type { INewOptions } from '@extension/models/BaseSCSIndexer';

export default class NautilusSCSIndexer extends BaseSCSIndexer {
  constructor({
    baseURL,
    canonicalName,
    id,
  }: TPartialExcept<INewOptions, 'baseURL'>) {
    super({
      baseURL,
      canonicalName: canonicalName || 'Nautilus',
      id: id || 'nautilus-scs-indexer',
    });
  }
}
