import { generate as generateUUID } from '@agoralabs-sh/uuid';

// enums
import { ExternalConfigMessageReferenceEnum } from '@common/enums';

// messages
import ExternalConfigRequestMessage from '@common/messages/ExternalConfigRequestMessage';

// types
import type { IResult as ExternalConfigResponseMessageResult } from '@common/messages/ExternalConfigResponseMessage';
import type { IBaseOptions, IExternalConfig, ILogger } from '@common/types';
import type { TListener } from './types';

// utils
import dispatchMessageWithTimeout from '@client/utils/dispatchMessageWithTimeout';

export default class ConfigManager {
  // private variables
  private readonly _logger: ILogger | null;
  private readonly _listeners: Map<string, TListener>;

  constructor({ logger }: IBaseOptions) {
    this._logger = logger || null;
    this._listeners = new Map<string, TListener>();

    // listen to middleware messages
    window.addEventListener(
      ExternalConfigMessageReferenceEnum.OnUpdate,
      this._onUpdateMessage.bind(this)
    );
  }

  /**
   * private functions
   */

  private async _onUpdateMessage(): Promise<void> {
    const _functionName = '_onUpdateMessage';
    let config: IExternalConfig | null;

    try {
      config = await this.config(); // fetch the new config details
    } catch (error) {
      this._logger?.debug(`${ConfigManager.name}#${_functionName}:`, error);

      return;
    }

    this._listeners.forEach((listener) => config && listener(config));
  }

  /**
   * public functions
   */

  public onUpdate(listener: TListener): string {
    const id = generateUUID();

    this._listeners.set(id, listener);

    return id;
  }

  public async config(): Promise<IExternalConfig | null> {
    const result = await dispatchMessageWithTimeout<
      ExternalConfigResponseMessageResult,
      ExternalConfigRequestMessage
    >({
      message: new ExternalConfigRequestMessage({
        id: generateUUID(),
        reference: ExternalConfigMessageReferenceEnum.Request,
      }),
      responseReference: ExternalConfigMessageReferenceEnum.Response,
      ...(this._logger && { logger: this._logger }),
    });

    return result?.config || null;
  }
}
