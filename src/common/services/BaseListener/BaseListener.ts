// types
import type { IBaseOptions, ILogger } from '@common/types';

export default abstract class BaseListener {
  // protected variables
  protected readonly _logger: ILogger | null;

  constructor({ logger }: IBaseOptions) {
    this._logger = logger || null;
  }

  /**
   * public functions
   */

  public abstract startListening(): void;
  public abstract stopListening(): void;
}
